import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import sanitizeFilename from "sanitize-filename";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_XML = "old-root/jeancarloem.WordPress.2023-08-09.xml";
const DEFAULT_PROVIDERS = "importador/providers.json";
const DEFAULT_CONCURRENCY = 3;
const DEFAULT_RETRIES = 3;
const DEFAULT_TIMEOUT_MS = 45000;

function parseArgs(argv) {
	const args = {
		xml: DEFAULT_XML,
		providers: DEFAULT_PROVIDERS,
		plan: true,
		run: false,
		limit: 0,
		concurrency: DEFAULT_CONCURRENCY,
		retries: DEFAULT_RETRIES,
		requestTimeoutMs: DEFAULT_TIMEOUT_MS
	};
	for (const arg of argv) {
		if (arg === "--plan") {
			args.plan = true;
			args.run = false;
		} else if (arg === "--run" || arg === "--write") {
			args.run = true;
			args.plan = false;
		} else if (arg.startsWith("--xml=")) args.xml = arg.slice("--xml=".length);
		else if (arg.startsWith("--providers=")) args.providers = arg.slice("--providers=".length);
		else if (arg.startsWith("--limit=")) args.limit = Number.parseInt(arg.slice("--limit=".length), 10) || 0;
		else if (arg.startsWith("--concurrency=")) args.concurrency = Math.max(1, Number.parseInt(arg.slice("--concurrency=".length), 10) || DEFAULT_CONCURRENCY);
		else if (arg.startsWith("--retries=")) args.retries = Math.max(1, Number.parseInt(arg.slice("--retries=".length), 10) || DEFAULT_RETRIES);
		else if (arg.startsWith("--request-timeout-ms=")) args.requestTimeoutMs = Math.max(1000, Number.parseInt(arg.slice("--request-timeout-ms=".length), 10) || DEFAULT_TIMEOUT_MS);
		else if (arg.startsWith("--max-seconds=")) args.requestTimeoutMs = Math.max(1000, (Number.parseInt(arg.slice("--max-seconds=".length), 10) || Math.ceil(DEFAULT_TIMEOUT_MS / 1000)) * 1000);
		else throw new Error(`Argumento desconhecido: ${arg}`);
	}
	return args;
}

function resolveRepo(relativePath) {
	return path.resolve(ROOT, relativePath);
}

function readJson(relativePath) {
	return JSON.parse(fs.readFileSync(resolveRepo(relativePath), "utf8"));
}

function ensureParent(filePath) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function xmlText(node, tagName) {
	return node.getElementsByTagName(tagName)[0]?.textContent?.trim() || "";
}

function directElements(node, tagName) {
	return Array.from(node.children).filter((child) => child.tagName === tagName);
}

function parseWxrMedia(xmlPath) {
	const xml = fs.readFileSync(xmlPath, "utf8").replace(/^\uFEFF/, "");
	const document = new JSDOM(xml, { contentType: "text/xml" }).window.document;
	const parseError = document.querySelector("parsererror");
	if (parseError) throw new Error(parseError.textContent.trim());
	const media = new Map();

	for (const item of document.querySelectorAll("item")) {
		const postId = xmlText(item, "wp:post_id");
		const postType = xmlText(item, "wp:post_type");
		const title = xmlText(item, "title");
		const attachmentUrl = xmlText(item, "wp:attachment_url");
		if (attachmentUrl) addMedia(media, attachmentUrl, { source: "wxr_attachment", postId, postType, title });

		const content = xmlText(item, "content:encoded");
		for (const url of extractUrls(content)) addMedia(media, url, { source: "wxr_content", postId, postType, title });
		for (const meta of directElements(item, "wp:postmeta")) {
			const value = xmlText(meta, "wp:meta_value");
			for (const url of extractUrls(value)) addMedia(media, url, { source: `wp_meta:${xmlText(meta, "wp:meta_key")}`, postId, postType, title });
		}
	}

	return Array.from(media.values()).sort((a, b) => a.url.localeCompare(b.url));
}

function extractUrls(value) {
	const urls = new Set();
	const text = String(value || "");
	const regex = /https?:\/\/[^\s"'<>\\)]+/gi;
	let match;
	while ((match = regex.exec(text))) {
		const cleaned = match[0].replace(/&amp;/g, "&").replace(/[.,;]+$/g, "");
		if (/\.(png|jpe?g|gif|webp|svg|pdf|mp3|mp4|webm|ogg|zip|gz|rar|7z)(\?|#|$)/i.test(cleaned) || cleaned.includes("/wp-content/uploads/")) {
			urls.add(cleaned);
		}
	}
	return Array.from(urls);
}

function addMedia(media, url, evidence) {
	const normalized = normalizeUrl(url);
	if (!normalized) return;
	const current = media.get(normalized) || { id: hash(normalized), url: normalized, evidence: [] };
	current.evidence.push(evidence);
	media.set(normalized, current);
}

function normalizeUrl(url) {
	try {
		const parsed = new URL(url);
		parsed.hash = "";
		return parsed.toString();
	} catch {
		return "";
	}
}

function hash(value) {
	return crypto.createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function outputPathFor(url, outputDir) {
	const parsed = new URL(url);
	const cleanPath = parsed.pathname.split("/").filter(Boolean).map((part) => sanitizeFilename(decodeURIComponentSafe(part)) || "x");
	const filename = cleanPath.pop() || `${hash(url)}.bin`;
	return resolveRepo(path.join(outputDir, parsed.hostname, ...cleanPath, filename));
}

function decodeURIComponentSafe(value) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

function loadState(stateFile) {
	const target = resolveRepo(stateFile);
	if (!fs.existsSync(target)) return { completed: {}, failed: {} };
	return JSON.parse(fs.readFileSync(target, "utf8"));
}

function saveState(stateFile, state) {
	const target = resolveRepo(stateFile);
	ensureParent(target);
	fs.writeFileSync(target, `${JSON.stringify(state, null, "\t")}\n`, "utf8");
}

function reconcileExistingFiles(items, config, state) {
	let reconciled = 0;
	for (const item of items) {
		if (state.completed?.[item.id]) continue;
		const outputPath = outputPathFor(item.url, config.mediaOutputDir);
		if (!fs.existsSync(outputPath)) continue;
		state.completed[item.id] = {
			url: item.url,
			output: path.relative(ROOT, outputPath).replace(/\\/g, "/"),
			provider: "existing-local-file",
			bytes: fs.statSync(outputPath).size
		};
		if (state.failed) delete state.failed[item.id];
		reconciled += 1;
	}
	return reconciled;
}

function appendAttempt(attemptLog, entry) {
	const target = resolveRepo(attemptLog);
	ensureParent(target);
	fs.appendFileSync(target, `${JSON.stringify({ time: new Date().toISOString(), ...entry })}\n`, "utf8");
}

async function fetchWithTimeout(url, options = {}) {
	const controller = new AbortController();
	const timeoutMs = options.requestTimeoutMs || DEFAULT_TIMEOUT_MS;
	const timeout = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const response = await fetch(url, {
			redirect: "follow",
			signal: controller.signal,
			headers: {
				"User-Agent": "jcem-importador/1.0 (+https://www.jeancarloem.com)"
			}
		});
		return response;
	} finally {
		clearTimeout(timeout);
	}
}

function compactPathForLog(filePath) {
	const normalized = String(filePath || "").replace(/\\/g, "/");
	const parts = normalized.split("/").filter(Boolean);
	if (parts.length <= 4) return normalized || "(sem arquivo)";
	return `${parts.slice(0, 2).join("/")}/.../${parts.slice(-2).join("/")}`;
}

function formatDuration(ms) {
	if (!Number.isFinite(ms) || ms <= 0) return "0s";
	const totalSeconds = Math.round(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	if (hours > 0) return `${hours}h${String(minutes).padStart(2, "0")}m`;
	if (minutes > 0) return `${minutes}m${String(seconds).padStart(2, "0")}s`;
	return `${seconds}s`;
}

function createProgressLogger(total, state) {
	const startedAt = Date.now();
	let started = 0;
	let processed = 0;
	let successThisRun = 0;
	let retryLaterThisRun = 0;
	let retryLaterNewThisRun = 0;
	let retryLaterResolvedThisRun = 0;
	const initialCompleted = Object.keys(state.completed || {}).length;
	const initialRetryLater = Object.keys(state.failed || {}).length;

	function snapshot() {
		const elapsedMs = Date.now() - startedAt;
		const remaining = Math.max(total - processed, 0);
		const avgMs = processed > 0 ? elapsedMs / processed : 0;
		return {
			elapsed: formatDuration(elapsedMs),
			eta: processed > 0 ? formatDuration(avgMs * remaining) : "calculando",
			processed,
			remaining,
			successTotal: initialCompleted + successThisRun,
			retryLaterTotal: Math.max(initialRetryLater + retryLaterNewThisRun - retryLaterResolvedThisRun, 0),
			successThisRun,
			retryLaterThisRun
		};
	}

	function suffix() {
		const data = snapshot();
		return `faltam=${data.remaining} ok=${data.successTotal} retry-depois=${data.retryLaterTotal} tempo=${data.elapsed} eta=${data.eta}`;
	}

	return {
		start(item, outputPath) {
			started += 1;
			console.log(`[media] ${started}/${total} trabalhando ${compactPathForLog(path.relative(ROOT, outputPath))} origem=${item.url} | ${suffix()}`);
		},
		retryNow(item, provider, attempt, retries, error) {
			const reason = error instanceof Error ? error.message : String(error);
			console.log(`[media] retry-agora ${attempt}/${retries} provider=${provider.id} arquivo=${compactPathForLog(new URL(item.url).pathname)} motivo=${reason.slice(0, 160)}`);
		},
		success(item, result, wasRetryLater = false) {
			processed += 1;
			successThisRun += 1;
			if (wasRetryLater) retryLaterResolvedThisRun += 1;
			console.log(`[media] ok arquivo=${compactPathForLog(result.output)} provider=${result.provider} bytes=${result.bytes || "local"} | ${suffix()}`);
		},
		retryLater(item, wasRetryLater = false) {
			processed += 1;
			retryLaterThisRun += 1;
			if (!wasRetryLater) retryLaterNewThisRun += 1;
			console.log(`[media] retry-depois arquivo=${compactPathForLog(new URL(item.url).pathname)} motivo=provedores-esgotados | ${suffix()}`);
		},
		summary() {
			const data = snapshot();
			console.log(`[media] resumo processados=${data.processed}/${total} ok-run=${data.successThisRun} retry-depois-run=${data.retryLaterThisRun} retry-resolvidos-run=${retryLaterResolvedThisRun} ok-total=${data.successTotal} retry-depois-total=${data.retryLaterTotal} tempo=${data.elapsed}`);
		}
	};
}

async function withRetry(fn, retries, onRetry) {
	let lastError;
	for (let attempt = 1; attempt <= retries; attempt += 1) {
		try {
			return await fn(attempt);
		} catch (error) {
			lastError = error;
			if (attempt < retries && onRetry) onRetry(error, attempt + 1);
			await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
		}
	}
	throw lastError;
}

async function recoverOne(item, config, state, options, logger) {
	const outputPath = outputPathFor(item.url, config.mediaOutputDir);
	logger.start(item, outputPath);
	if (fs.existsSync(outputPath)) {
		const wasRetryLater = Boolean(state.failed?.[item.id]);
		state.completed[item.id] = { url: item.url, output: path.relative(ROOT, outputPath).replace(/\\/g, "/"), provider: "existing-local-file" };
		if (state.failed) delete state.failed[item.id];
		logger.success(item, state.completed[item.id], wasRetryLater);
		return state.completed[item.id];
	}

	for (const provider of config.providers.filter((entry) => entry.enabled !== false)) {
		try {
			const result = await withRetry(
				() => recoverFromProvider(item, provider, outputPath, options),
				options.retries,
				(error, nextAttempt) => logger.retryNow(item, provider, nextAttempt, options.retries, error)
			);
			if (!result) {
				appendAttempt(config.attemptLog, { id: item.id, url: item.url, provider: provider.id, status: "miss" });
				continue;
			}
			const wasRetryLater = Boolean(state.failed?.[item.id]);
			state.completed[item.id] = result;
			if (state.failed) delete state.failed[item.id];
			appendAttempt(config.attemptLog, { id: item.id, url: item.url, provider: provider.id, status: "ok", output: result.output });
			logger.success(item, result, wasRetryLater);
			return result;
		} catch (error) {
			appendAttempt(config.attemptLog, { id: item.id, url: item.url, provider: provider.id, status: "error", error: error instanceof Error ? error.message : String(error) });
		}
	}

	const wasRetryLater = Boolean(state.failed?.[item.id]);
	state.failed[item.id] = { url: item.url, lastTriedAt: new Date().toISOString() };
	logger.retryLater(item, wasRetryLater);
	return null;
}

async function recoverFromProvider(item, provider, outputPath, options) {
	if (provider.type === "local-wp-uploads") return recoverLocal(item, provider, outputPath);
	if (provider.type === "direct") return recoverDirect(item, provider.url.replace("{url}", encodeURIComponent(item.url)), provider, outputPath, options);
	if (provider.type === "cdx") {
		const endpoint = provider.endpoint.replace("{url}", encodeURIComponent(item.url));
		const response = await fetchWithTimeout(endpoint, options);
		if (!response.ok) throw new Error(`CDX HTTP ${response.status}`);
		const data = await response.json();
		const rows = Array.isArray(data) ? data.slice(1) : [];
		for (const row of rows) {
			const [timestamp, original] = row;
			if (!timestamp || !original) continue;
			const snapshot = provider.snapshot.replace("{timestamp}", timestamp).replace("{original}", original);
			const result = await recoverDirect(item, snapshot, provider, outputPath, options);
			if (result) return result;
		}
		return null;
	}
	throw new Error(`Tipo de provedor desconhecido: ${provider.type}`);
}

function recoverLocal(item, provider, outputPath) {
	const parsed = new URL(item.url);
	const uploadsPrefix = "/wp-content/uploads/";
	const index = parsed.pathname.indexOf(uploadsPrefix);
	if (index < 0) return null;
	const relative = parsed.pathname.slice(index + 1).split("/").map(decodeURIComponentSafe);
	const source = resolveRepo(path.join(provider.root, ...relative));
	if (!fs.existsSync(source)) return null;
	ensureParent(outputPath);
	fs.copyFileSync(source, outputPath);
	return {
		url: item.url,
		provider: provider.id,
		output: path.relative(ROOT, outputPath).replace(/\\/g, "/"),
		bytes: fs.statSync(outputPath).size
	};
}

async function recoverDirect(item, url, provider, outputPath, options) {
	const response = await fetchWithTimeout(url, options);
	if (!response.ok) return null;
	const buffer = Buffer.from(await response.arrayBuffer());
	if (buffer.length === 0) return null;
	ensureParent(outputPath);
	fs.writeFileSync(outputPath, buffer);
	return {
		url: item.url,
		provider: provider.id,
		providerUrl: url,
		output: path.relative(ROOT, outputPath).replace(/\\/g, "/"),
		bytes: buffer.length,
		contentType: response.headers.get("content-type") || ""
	};
}

async function runPool(items, worker, concurrency) {
	let index = 0;
	const workers = Array.from({ length: concurrency }, async () => {
		while (index < items.length) {
			const current = items[index];
			index += 1;
			await worker(current);
		}
	});
	await Promise.all(workers);
}

async function main() {
	const options = parseArgs(process.argv.slice(2));
	const xmlPath = resolveRepo(options.xml);
	if (!fs.existsSync(xmlPath)) throw new Error(`XML nao encontrado: ${xmlPath}`);
	const config = readJson(options.providers);
	const state = loadState(config.stateFile);
	const allItems = parseWxrMedia(xmlPath);
	const reconciled = reconcileExistingFiles(allItems, config, state);
	if (options.run && reconciled > 0) {
		console.log(`[media] checklist-local reconciliados=${reconciled}`);
		saveState(config.stateFile, state);
	}
	const pending = allItems.filter((item) => !state.completed[item.id]);
	const selected = options.limit > 0 ? pending.slice(0, options.limit) : pending;
	const logger = createProgressLogger(selected.length, state);

	if (options.plan) {
		console.log(JSON.stringify({
			mode: "plan",
			totalMedia: allItems.length,
			localExistingReconciled: reconciled,
			pending: pending.length,
			selected: selected.length,
			providers: config.providers.filter((provider) => provider.enabled !== false).map((provider) => provider.id)
		}, null, "\t"));
		return;
	}

	await runPool(selected, async (item) => {
		await recoverOne(item, config, state, options, logger);
		saveState(config.stateFile, state);
	}, options.concurrency);
	saveState(config.stateFile, state);
	logger.summary();
}

try {
	await main();
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
}
