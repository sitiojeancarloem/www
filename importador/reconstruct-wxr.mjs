import crypto from "crypto";
import fs from "fs";
import path from "path";
import sanitizeFilename from "sanitize-filename";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_XML = "old-root/jeancarloem.WordPress.2023-08-09.xml";
const DEFAULT_DRAFTS = "_drafts";
const REPORT_PATH = "importador/state/reconstruction-report.json";
const MANIFEST_PATH = "importador/state/wxr-manifest.json";
const TEXT_TYPES = new Set(["post", "page"]);

function parseArgs(argv) {
	const args = {
		xml: DEFAULT_XML,
		drafts: DEFAULT_DRAFTS,
		write: false,
		force: false,
		types: new Set(["post", "page"]),
		statuses: null,
		limit: 0
	};

	for (const arg of argv) {
		if (arg === "--write") args.write = true;
		else if (arg === "--dry-run") args.write = false;
		else if (arg === "--force") args.force = true;
		else if (arg.startsWith("--xml=")) args.xml = arg.slice("--xml=".length);
		else if (arg.startsWith("--drafts=")) args.drafts = arg.slice("--drafts=".length);
		else if (arg.startsWith("--type=")) args.types = new Set(arg.slice("--type=".length).split(",").map((v) => v.trim()).filter(Boolean));
		else if (arg.startsWith("--status=")) args.statuses = new Set(arg.slice("--status=".length).split(",").map((v) => v.trim()).filter(Boolean));
		else if (arg.startsWith("--limit=")) args.limit = Number.parseInt(arg.slice("--limit=".length), 10) || 0;
		else throw new Error(`Argumento desconhecido: ${arg}`);
	}

	return args;
}

function resolveRepo(relativePath) {
	return path.resolve(ROOT, relativePath);
}

function ensureParent(filePath) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readText(filePath) {
	return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function xmlText(node, tagName) {
	return node.getElementsByTagName(tagName)[0]?.textContent?.trim() || "";
}

function directElements(node, tagName) {
	return Array.from(node.children).filter((child) => child.tagName === tagName);
}

function sha256(value) {
	return crypto.createHash("sha256").update(value).digest("hex");
}

function yamlString(value) {
	const normalized = String(value ?? "").replace(/\r\n?/g, "\n");
	if (!normalized) return "\"\"";
	if (/^[A-Za-z0-9_./:@ -]+$/.test(normalized) && !/^(true|false|null|yes|no|on|off)$/i.test(normalized)) return normalized;
	return JSON.stringify(normalized);
}

function yamlList(values) {
	const items = Array.from(new Set(values.filter(Boolean)));
	if (items.length === 0) return "[]";
	return `\n${items.map((value) => `  - ${yamlString(value)}`).join("\n")}`;
}

function slugify(value, fallback) {
	const base = String(value || fallback || "sem-titulo")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/&/g, " e ")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
	return sanitizeFilename(base || fallback || "sem-titulo").replace(/\s+/g, "-").toLowerCase();
}

function normalizeComparable(value) {
	return String(value || "")
		.replace(/---[\s\S]*?---/, "")
		.replace(/<[^>]+>/g, " ")
		.replace(/\[[^\]]+\]\([^)]+\)/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.toLowerCase();
}

function escapeMarkdownText(value) {
	return String(value || "").replace(/\r\n?/g, "\n").trim();
}

function protectComments(html) {
	const comments = [];
	const protectedHtml = html.replace(/<!--[\s\S]*?-->/g, (match) => {
		const token = `JCEM_COMMENT_${comments.length}_TOKEN`;
		comments.push([token, match]);
		return token;
	});
	return { protectedHtml, comments };
}

function restoreComments(markdown, comments) {
	return comments.reduce((current, [token, value]) => current.replaceAll(token, value), markdown);
}

function createTurndown() {
	const service = new TurndownService({
		headingStyle: "atx",
		codeBlockStyle: "fenced",
		bulletListMarker: "-",
		emDelimiter: "*",
		strongDelimiter: "**"
	});

	service.use(gfm);
	service.keep([
		"table",
		"thead",
		"tbody",
		"tfoot",
		"tr",
		"th",
		"td",
		"script",
		"style",
		"template",
		"iframe",
		"object",
		"embed",
		"form",
		"input",
		"textarea",
		"select",
		"option",
		"math",
		"svg"
	]);

	service.addRule("safeLinks", {
		filter: "a",
		replacement(content, node) {
			const href = node.getAttribute("href") || "";
			const text = content.trim() || node.textContent.trim() || href;
			if (!href) return text;
			if (href.startsWith("#")) return `[${text}](${href})`;
			return `[${text}](${href.replace(/\s/g, "%20")})`;
		}
	});

	service.addRule("safeImages", {
		filter: "img",
		replacement(_content, node) {
			const src = node.getAttribute("src") || "";
			const alt = (node.getAttribute("alt") || "").replace(/\]/g, "\\]");
			const title = node.getAttribute("title");
			if (!src) return "";
			return title ? `![${alt}](${src.replace(/\s/g, "%20")} ${JSON.stringify(title)})` : `![${alt}](${src.replace(/\s/g, "%20")})`;
		}
	});

	return service;
}

function convertHtmlToMarkdown(html) {
	if (!html.trim()) return "";
	const { protectedHtml, comments } = protectComments(html);
	const dom = new JSDOM(`<main>${protectedHtml}</main>`);
	const main = dom.window.document.querySelector("main");
	for (const el of main.querySelectorAll("[style]")) {
		const tag = el.tagName.toLowerCase();
		if (!["span", "div", "p", "strong", "em"].includes(tag)) continue;
		const style = el.getAttribute("style") || "";
		if (/display\s*:\s*none/i.test(style)) el.remove();
	}
	const markdown = createTurndown().turndown(main.innerHTML).replace(/\n{3,}/g, "\n\n").trim();
	return restoreComments(markdown, comments);
}

function parseWxr(xmlPath) {
	const xml = readText(xmlPath);
	const document = new JSDOM(xml, { contentType: "text/xml" }).window.document;
	const parseError = document.querySelector("parsererror");
	if (parseError) throw new Error(parseError.textContent.trim());

	const channel = document.querySelector("channel");
	const authors = directElements(channel, "wp:author").map((node) => ({
		id: xmlText(node, "wp:author_id"),
		login: xmlText(node, "wp:author_login"),
		email: xmlText(node, "wp:author_email"),
		displayName: xmlText(node, "wp:author_display_name"),
		firstName: xmlText(node, "wp:author_first_name"),
		lastName: xmlText(node, "wp:author_last_name")
	}));
	const taxonomies = {
		categories: directElements(channel, "wp:category").map((node) => ({
			id: xmlText(node, "wp:term_id"),
			nicename: xmlText(node, "wp:category_nicename"),
			parent: xmlText(node, "wp:category_parent"),
			name: xmlText(node, "wp:cat_name")
		})),
		tags: directElements(channel, "wp:tag").map((node) => ({
			id: xmlText(node, "wp:term_id"),
			slug: xmlText(node, "wp:tag_slug"),
			name: xmlText(node, "wp:tag_name")
		})),
		terms: directElements(channel, "wp:term").map((node) => ({
			id: xmlText(node, "wp:term_id"),
			taxonomy: xmlText(node, "wp:term_taxonomy"),
			slug: xmlText(node, "wp:term_slug"),
			parent: xmlText(node, "wp:term_parent"),
			name: xmlText(node, "wp:term_name")
		}))
	};

	const items = Array.from(document.querySelectorAll("item")).map((item) => {
		const categoryNodes = directElements(item, "category").map((node) => ({
			domain: node.getAttribute("domain") || "",
			nicename: node.getAttribute("nicename") || "",
			value: node.textContent.trim()
		}));
		const postmeta = directElements(item, "wp:postmeta").map((node) => ({
			key: xmlText(node, "wp:meta_key"),
			value: xmlText(node, "wp:meta_value")
		}));
		const comments = directElements(item, "wp:comment").map((node) => ({
			id: xmlText(node, "wp:comment_id"),
			author: xmlText(node, "wp:comment_author"),
			authorEmail: xmlText(node, "wp:comment_author_email"),
			authorUrl: xmlText(node, "wp:comment_author_url"),
			authorIp: xmlText(node, "wp:comment_author_IP"),
			date: xmlText(node, "wp:comment_date"),
			dateGmt: xmlText(node, "wp:comment_date_gmt"),
			content: xmlText(node, "wp:comment_content"),
			approved: xmlText(node, "wp:comment_approved"),
			type: xmlText(node, "wp:comment_type"),
			parent: xmlText(node, "wp:comment_parent"),
			userId: xmlText(node, "wp:comment_user_id")
		}));
		return {
			title: xmlText(item, "title"),
			link: xmlText(item, "link"),
			pubDate: xmlText(item, "pubDate"),
			creator: xmlText(item, "dc:creator"),
			content: xmlText(item, "content:encoded"),
			excerpt: xmlText(item, "excerpt:encoded"),
			postId: xmlText(item, "wp:post_id"),
			postDate: xmlText(item, "wp:post_date"),
			postDateGmt: xmlText(item, "wp:post_date_gmt"),
			postModified: xmlText(item, "wp:post_modified"),
			postModifiedGmt: xmlText(item, "wp:post_modified_gmt"),
			commentStatus: xmlText(item, "wp:comment_status"),
			pingStatus: xmlText(item, "wp:ping_status"),
			postName: xmlText(item, "wp:post_name"),
			status: xmlText(item, "wp:status"),
			postParent: xmlText(item, "wp:post_parent"),
			menuOrder: xmlText(item, "wp:menu_order"),
			postType: xmlText(item, "wp:post_type"),
			postPassword: xmlText(item, "wp:post_password"),
			isSticky: xmlText(item, "wp:is_sticky"),
			attachmentUrl: xmlText(item, "wp:attachment_url"),
			categories: categoryNodes,
			postmeta,
			comments
		};
	});

	return {
		wxrVersion: xmlText(channel, "wp:wxr_version"),
		baseSiteUrl: xmlText(channel, "wp:base_site_url"),
		baseBlogUrl: xmlText(channel, "wp:base_blog_url"),
		authors,
		taxonomies,
		items
	};
}

function findExistingDrafts(draftsRoot, slug) {
	const candidates = [];
	const fileCandidate = path.join(draftsRoot, `${slug}.md`);
	if (fs.existsSync(fileCandidate)) candidates.push(fileCandidate);
	const dirCandidate = path.join(draftsRoot, slug);
	if (fs.existsSync(dirCandidate)) {
		for (const name of ["convertido.md", "reconstruido.md", "processed.html", "pandoc_input.html"]) {
			const candidate = path.join(dirCandidate, name);
			if (fs.existsSync(candidate)) candidates.push(candidate);
		}
		for (const entry of fs.readdirSync(dirCandidate)) {
			const candidate = path.join(dirCandidate, entry);
			if (/\.md$/i.test(entry) && !candidates.includes(candidate)) candidates.push(candidate);
		}
	}
	return candidates;
}

function buildFrontMatter(item, slug, existingSources) {
	const categories = item.categories.filter((entry) => entry.domain === "category").map((entry) => entry.value);
	const tags = item.categories.filter((entry) => entry.domain === "post_tag").map((entry) => entry.value);
	const sourceList = [item.link, ...existingSources.map((source) => path.relative(ROOT, source).replace(/\\/g, "/"))].filter(Boolean);
	const lines = [
		"---",
		`title: ${yamlString(item.title || slug)}`,
		`date: ${yamlString(item.postDate || item.pubDate)}`,
		item.postModified ? `last_modified_at: ${yamlString(item.postModified)}` : "",
		"published: false",
		`wp_status: ${yamlString(item.status)}`,
		`wp_post_id: ${yamlString(item.postId)}`,
		`wp_post_type: ${yamlString(item.postType)}`,
		`wp_slug: ${yamlString(item.postName || slug)}`,
		item.creator ? `author: ${yamlString(item.creator)}` : "",
		`categories: ${yamlList(categories)}`,
		`tags: ${yamlList(tags)}`,
		"reconstruction:",
		"  primary_source: wordpress_wxr_2023_08_09",
		`  content_sha256: ${yamlString(sha256(item.content || ""))}`,
		`  source_urls: ${yamlList(sourceList)}`,
		item.excerpt ? `excerpt: ${yamlString(convertHtmlToMarkdown(item.excerpt))}` : "",
		"---"
	].filter((line) => line !== "");
	return `${lines.join("\n")}\n\n`;
}

function appendSecondaryEvidence(primaryMarkdown, existingSources) {
	let merged = primaryMarkdown.trim();
	const comparablePrimary = normalizeComparable(primaryMarkdown);
	const appended = [];

	for (const source of existingSources) {
		if (!/\.md$/i.test(source)) continue;
		const content = readText(source).trim();
		const comparable = normalizeComparable(content);
		if (!comparable || comparablePrimary.includes(comparable.slice(0, Math.min(1200, comparable.length)))) continue;
		if (comparable.length < Math.max(600, comparablePrimary.length * 0.18)) continue;
		appended.push({ source, content });
	}

	if (appended.length === 0) return merged;

	merged += "\n\n<!-- JCEM-RECONSTRUCAO: evidencia secundaria preservada para revisao manual. -->\n";
	for (const entry of appended) {
		const relative = path.relative(ROOT, entry.source).replace(/\\/g, "/");
		merged += `\n<details class=\"jcem-reconstruction-secondary-source\" markdown=\"1\">\n<summary>Evidencia complementar preservada: ${relative}</summary>\n\n${entry.content}\n\n</details>\n`;
	}
	return merged.trim();
}

function buildDraft(item, slug, existingSources) {
	const converted = convertHtmlToMarkdown(item.content);
	const content = converted || escapeMarkdownText(item.content) || "_Conteudo ausente no XML._";
	const merged = appendSecondaryEvidence(content, existingSources);
	return buildFrontMatter(item, slug, existingSources) + `${merged.trim()}\n`;
}

function chooseTarget(draftsRoot, slug) {
	return path.join(draftsRoot, slug, "reconstruido.md");
}

function writeIfNeeded(target, content, options) {
	if (!options.write) return { action: "planned", path: target };
	ensureParent(target);
	if (!fs.existsSync(target)) {
		fs.writeFileSync(target, content, "utf8");
		return { action: "created", path: target };
	}
	const current = readText(target);
	if (current === content) return { action: "unchanged", path: target };
	if (options.force) {
		fs.writeFileSync(target, content, "utf8");
		return { action: "updated", path: target };
	}
	const candidate = target.replace(/\.md$/i, ".candidate.md");
	fs.writeFileSync(candidate, content, "utf8");
	return { action: "candidate", path: candidate, existing: target };
}

function buildManifest(wxr) {
	const counts = {};
	for (const item of wxr.items) counts[item.postType] = (counts[item.postType] || 0) + 1;
	return {
		generatedAt: new Date().toISOString(),
		wxrVersion: wxr.wxrVersion,
		baseSiteUrl: wxr.baseSiteUrl,
		baseBlogUrl: wxr.baseBlogUrl,
		counts,
		authors: wxr.authors,
		taxonomies: wxr.taxonomies,
		items: wxr.items.map((item) => ({
			postId: item.postId,
			type: item.postType,
			status: item.status,
			title: item.title,
			slug: item.postName,
			date: item.postDate,
			modified: item.postModified,
			link: item.link,
			attachmentUrl: item.attachmentUrl,
			metaCount: item.postmeta.length,
			commentCount: item.comments.length,
			contentSha256: sha256(item.content || "")
		}))
	};
}

function main() {
	const options = parseArgs(process.argv.slice(2));
	const xmlPath = resolveRepo(options.xml);
	const draftsRoot = resolveRepo(options.drafts);
	if (!fs.existsSync(xmlPath)) throw new Error(`XML nao encontrado: ${xmlPath}`);

	const wxr = parseWxr(xmlPath);
	const manifest = buildManifest(wxr);
	const seenSlugs = new Map();
	const report = {
		generatedAt: new Date().toISOString(),
		mode: options.write ? "write" : "dry-run",
		xml: path.relative(ROOT, xmlPath).replace(/\\/g, "/"),
		drafts: path.relative(ROOT, draftsRoot).replace(/\\/g, "/"),
		items: []
	};

	const items = wxr.items.filter((item) => {
		if (!TEXT_TYPES.has(item.postType)) return false;
		if (!options.types.has(item.postType)) return false;
		if (options.statuses && !options.statuses.has(item.status)) return false;
		return true;
	});
	const selected = options.limit > 0 ? items.slice(0, options.limit) : items;

	for (const item of selected) {
		const baseSlug = slugify(item.postName || item.title, `wp-${item.postId}`);
		const previous = seenSlugs.get(baseSlug) || 0;
		seenSlugs.set(baseSlug, previous + 1);
		const slug = previous === 0 ? baseSlug : `${baseSlug}-${item.postId || previous + 1}`;
		const existingSources = findExistingDrafts(draftsRoot, slug);
		const draft = buildDraft(item, slug, existingSources);
		const target = chooseTarget(draftsRoot, slug);
		const writeResult = writeIfNeeded(target, draft, options);
		report.items.push({
			postId: item.postId,
			type: item.postType,
			status: item.status,
			title: item.title,
			slug,
			target: path.relative(ROOT, writeResult.path).replace(/\\/g, "/"),
			action: writeResult.action,
			existing: writeResult.existing ? path.relative(ROOT, writeResult.existing).replace(/\\/g, "/") : undefined,
			existingSources: existingSources.map((source) => path.relative(ROOT, source).replace(/\\/g, "/")),
			contentSha256: sha256(draft)
		});
	}

	if (options.write) {
		ensureParent(resolveRepo(REPORT_PATH));
		fs.writeFileSync(resolveRepo(MANIFEST_PATH), `${JSON.stringify(manifest, null, "\t")}\n`, "utf8");
		fs.writeFileSync(resolveRepo(REPORT_PATH), `${JSON.stringify(report, null, "\t")}\n`, "utf8");
	}

	const summary = report.items.reduce((acc, item) => {
		acc[item.action] = (acc[item.action] || 0) + 1;
		return acc;
	}, {});
	console.log(JSON.stringify({
		mode: report.mode,
		wxrVersion: wxr.wxrVersion,
		totalItems: wxr.items.length,
		selectedItems: selected.length,
		counts: manifest.counts,
		actions: summary
	}, null, "\t"));
}

try {
	main();
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
}
