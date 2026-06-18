import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import sanitize from "sanitize-filename";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import crypto from "crypto";
import urlModule from "url";

const url = process.argv[2];
if (!url) {
  console.error("Uso: node extract.js <URL_DO_ARTIGO>");
  process.exit(1);
}

const ROOT = path.join(process.cwd(), `_drafts`);
const MAX_RETRIES = 3;
const TIMEOUT_MS = 60000;

// --------------------
// Utilitários básicos
// --------------------
function saveFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function hashUrl(url) {
  return crypto.createHash("md5").update(url).digest("hex");
}

async function fetchWithRetry(url) {
  for (let i = 1; i <= MAX_RETRIES; i++) {
    try {
      console.log(`🔗 Baixando página (tentativa ${i})...`);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error("HTTP status " + res.status);
      return await res.text();
    } catch (err) {
      console.warn(`⚠️ Falha na tentativa ${i}: ${err.message}`);
      if (i === MAX_RETRIES) throw err;
      console.log("⏱️ Retentando em 3s...");
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

// --------------------
// Download de imagens
// --------------------
async function downloadImage(srcUrl, folder) {
  try {
    const parsed = urlModule.parse(srcUrl);
    let filename = path.basename(parsed.pathname || "imagem.jpg");
    if (!filename) filename = "img_" + crypto.randomBytes(4).toString("hex");
    filename = sanitize(filename);
    const res = await fetch(srcUrl);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const imgPath = path.join(folder, "imagens", filename);
    fs.mkdirSync(path.dirname(imgPath), { recursive: true });
    fs.writeFileSync(imgPath, buffer);
    return path.relative(folder, imgPath).replace(/\\/g, "/");
  } catch {
    return null;
  }
}

// --------------------
// Filtro de conteúdo
// --------------------
function filterVisibleContent(document) {
  const firstH1 = document.querySelector("h1");
  if (firstH1) {
    let sibling = firstH1.previousElementSibling;
    while (sibling) {
      const prev = sibling.previousElementSibling;
      sibling.remove();
      sibling = prev;
    }
  }

  const authorEl =
    document.querySelector(".author") ||
    document.querySelector(".post-author") ||
    document.querySelector("footer");
  if (authorEl) {
    let next = authorEl.nextElementSibling;
    while (next) {
      const tmp = next.nextElementSibling;
      next.remove();
      next = tmp;
    }
  }
}

// --------------------
// Processamento da página
// --------------------
async function processPage(html, folder, baseTitle) {
  const dom = new JSDOM(html, { url });
  const document = dom.window.document;

  console.log("📖 Extraindo conteúdo principal...");
  const reader = new Readability(document);
  const article = reader.parse();

  const author =
    document.querySelector('meta[name="author"]')?.content ||
    document.querySelector('meta[property="article:author"]')?.content ||
    "";
  const date =
    document.querySelector('meta[property="article:published_time"]')
      ?.content ||
    document.querySelector("time")?.getAttribute("datetime") ||
    "";

  // 🔹 Seção de referências
  let refSection = "";
  const refEl = [...document.querySelectorAll("h2, h3, h4")].find((el) =>
    /refer(ê|e)ncias|bibliografia/i.test(el.textContent)
  );
  if (refEl) {
    let htmlRefs = refEl.outerHTML;
    let next = refEl.nextElementSibling;
    while (next && !/^H[2-4]$/.test(next.tagName)) {
      htmlRefs += next.outerHTML;
      next = next.nextElementSibling;
    }
    refSection = htmlRefs;
  }

  const processedHTML = `<article>
<h1>${article?.title || "Sem título"}</h1>
${article?.content || html}
${refSection}
</article>`;

  const processedPath = path.join(folder, `processed.html`);
  saveFile(processedPath, processedHTML);
  console.log("💾 HTML processado salvo em:", processedPath);

  // 🔹 Corrige todas as imagens externas antes do Pandoc
  const imgTags = [...document.querySelectorAll("img")];
  for (const img of imgTags) {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("data:")) {
      const localPath = await downloadImage(src, folder);
      if (localPath) img.setAttribute("src", localPath);
    }
  }

  // Salva HTML ajustado
  const localHTMLPath = path.join(folder, "pandoc_input.html");
  saveFile(localHTMLPath, document.documentElement.outerHTML);

  // --------------------
  // Pandoc + fallback
  // --------------------
  console.log("⚙️ Convertendo para Markdown...");
  const mdPath = path.join(folder, `${baseTitle}.md`);
  let pandocSuccess = false;
  try {
    const cmd = `pandoc -f html -t gfm --wrap=none --strip-comments --extract-media="${folder}/imagens" "${localHTMLPath}" -o "${mdPath}"`;
    execSync(cmd, { stdio: "inherit" });
    pandocSuccess = true;
  } catch (err) {
    console.warn("⚠️ Pandoc falhou. Usando Turndown...");
  }

  let mdContent =
    pandocSuccess && fs.existsSync(mdPath)
      ? fs.readFileSync(mdPath, "utf8")
      : processedHTML;

  const turndownService = new TurndownService({ headingStyle: "atx" });
  turndownService.use(gfm);

  // 🔹 Footnotes
  const supElements = [...document.querySelectorAll("sup")].filter(
    (sup) =>
      sup.querySelector("a") &&
      /fn\d+/.test(sup.querySelector("a").getAttribute("href") || "")
  );
  let footnoteCounter = 1;
  const footnotesMap = {};
  supElements.forEach((sup) => {
    const a = sup.querySelector("a");
    const href = a.getAttribute("href");
    const id = href.replace(/^#/, "");
    footnotesMap[id] = footnoteCounter;
    a.replaceWith(document.createTextNode(`[^${footnoteCounter}]`));
    footnoteCounter++;
  });

  const footnoteDefs = [];
  [...document.querySelectorAll("li[id^='fn']")].forEach((li) => {
    const id = li.getAttribute("id");
    const num = footnotesMap[id];
    if (num) footnoteDefs.push(`[^${num}]: ${li.textContent.trim()}`);
  });

  // 🔹 Regras Turndown
  turndownService.addRule("fixLinks", {
    filter: "a",
    replacement: (content, node) => {
      const href = node.getAttribute("href") || "";
      if (!href || href.startsWith("#")) return node.textContent.trim();
      const text = node.textContent.replace(/\s+/g, " ").trim();
      const safeHref = encodeURI(href);
      return `[${text}](${safeHref})`;
    },
  });

  turndownService.addRule("headings", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: (content, node) => {
      const level = parseInt(node.nodeName.charAt(1));
      const innerMarkdown = turndownService.turndown(node.innerHTML).trim();
      return "\n" + "#".repeat(level) + " " + innerMarkdown + "\n";
    },
  });

  // 🔹 Filtra conteúdo
  filterVisibleContent(document);

  mdContent = turndownService.turndown(document.body.innerHTML);
  mdContent += "\n\n" + footnoteDefs.join("\n") + "\n";

  // Corrige footnotes fora de blocos de código
  const lines = mdContent.split("\n");
  let inCodeBlock = false;
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (/^```/.test(line.trim())) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (!inCodeBlock && !/^ {4}/.test(line) && !line.trim().startsWith("`")) {
      line = line.replace(/\\?\[\^?(\d+)\\?\]/g, "[^$1]");
      lines[i] = line;
    }
  }
  mdContent = lines.join("\n");

  // 🔹 YAML
  const yaml = [
    "---",
    `title: "${article?.title?.replace(/"/g, '\\"') || "Sem título"}"`,
    author ? `author: "${author.replace(/"/g, '\\"')}"` : "",
    date ? `date: "${date}"` : "",
    `source: "${url}"`,
    "---\n",
  ]
    .filter(Boolean)
    .join("\n");

  fs.writeFileSync(mdPath, yaml + mdContent);
  console.log("📝 Markdown final com tabelas, imagens e footnotes OK!");
}

// --------------------
// Execução principal
// --------------------
(async () => {
  console.log(" ");
  try {
    const folder = path.join(ROOT, hashUrl(url));
    fs.mkdirSync(folder, { recursive: true });

    const htmlPath = path.join(folder, `original.html`);
    let html;
    if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).size > 0) {
      console.log("📄 HTML já existe, usando arquivo local...");
      html = fs.readFileSync(htmlPath, "utf8");
    } else {
      html = await fetchWithRetry(url);
      saveFile(htmlPath, html);
      console.log("💾 HTML original baixado e salvo em:", htmlPath);
    }

    await processPage(html, folder, `convertido`);
    console.log(`✅ Tudo pronto! Arquivos salvos em: ${folder}`);
  } catch (err) {
    console.error("❌ Erro final:", err);
  }
  console.log(" ");
})();
