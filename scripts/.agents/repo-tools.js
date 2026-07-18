// Dispatcher local de comandos agent:*. Contrato: .agents/meta/{cli,ia,maintenance,validation}.md.
const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { filterOutput } = require("./to-ia");

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const PACKAGE_PATH = path.join(ROOT_DIR, "package.json");
const CONTINUE_PATH = path.join(ROOT_DIR, ".agents", "continue.ia");
const NPM = process.platform === "win32" ? "npm.cmd" : "npm";
const BUNDLE = process.platform === "win32" ? "bundle.bat" : "bundle";

const NA_REASONS = {
  "agent:clean": "limpeza destrutiva sem alvo local declarado",
  "agent:repair": "reparo gerado ainda sem contrato local",
  "agent:dist": "o blog publica por Jekyll, não por dist de pacote",
  "agent:package": "o blog não distribui pacote de software",
  "agent:release": "RCF não declara cenário Release",
  "agent:release:trigger": "RCF não declara cenário Release",
  "agent:release:publish": "RCF não declara cenário Release",
  "agent:rollback": "rollback exige destino de publicação declarado",
  "agent:format": "formatador global não foi declarado",
  "agent:benchmark": "benchmark local não foi declarado",
  "agent:security": "auditoria de segurança especializada não foi declarada",
  "agent:update-deps": "atualização de dependência exige FT própria",
  "agent:licenses": "relatório de licenças não foi declarado",
  "agent:parse-data": "parser de dados genérico não se aplica",
  "agent:summarize": "sumarização genérica não se aplica",
  "agent:convert": "conversão genérica não se aplica",
  "agent:validate-data": "validação genérica de dados não se aplica",
  "agent:index-data": "indexação genérica de dados não se aplica",
  "agent:query-data": "consulta genérica de dados não se aplica",
  "agent:git-fetch": "rede não é acionada por dispatcher local",
  "agent:git-pull": "mutação Git não é acionada por dispatcher local",
  "agent:git-push": "mutação Git não é acionada por dispatcher local",
  "agent:git-sync": "mutação Git não é acionada por dispatcher local",
  "agent:git-add": "staging exige operação Git explícita",
  "agent:git-commit": "commit exige operação Git explícita",
  "agent:git-switch": "troca de branch exige operação Git explícita",
  "agent:git-reset": "reset é destrutivo",
  "agent:git-restore": "restore é destrutivo",
  "agent:git-clean": "clean é destrutivo",
  "agent:git-stash": "stash altera estado Git",
  "agent:git-prune": "prune altera estado Git",
  "agent:git-gc": "gc altera estado Git",
  "agent:logs": "fonte de logs não foi declarada",
  "agent:process": "inventário de processos não foi declarado",
  "agent:kill": "encerramento de processo exige alvo e confirmação",
  "agent:ports": "inventário de portas não foi declarado",
  "agent:extract": "extração genérica não foi declarada",
  "agent:index": "índice normativo separado não é necessário ao blog",
  "agent:git-changelog": "changelog de software não se aplica",
  "agent:git-last-release": "RCF não declara cenário Release",
  "agent:git-release-notes": "RCF não declara cenário Release",
};

function packageScripts() {
  return Object.keys(JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8")).scripts || {}).filter((name) => name.startsWith("agent:"));
}

function result(exit, stdout = "", stderr = "") {
  return { exit, stdout, stderr };
}

function run(command, args = [], options = {}) {
  const executed = childProcess.spawnSync(command, args, {
    cwd: ROOT_DIR,
    encoding: "utf8",
    shell: false,
    timeout: options.timeout || 30000,
  });
  return result(Number.isInteger(executed.status) ? executed.status : 1, executed.stdout || "", `${executed.stderr || ""}${executed.error ? `\n${executed.error.message}` : ""}`);
}

function windowsArgument(value) {
  const text = String(value);
  return /[\s"]/u.test(text) ? `"${text.replace(/"/gu, "\\\"")}"` : text;
}

function runWindowsCommand(command, args, options = {}) {
  if (process.platform !== "win32") return run(command, args, options);
  return run(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", [command, ...args].map(windowsArgument).join(" ")], options);
}

function runBundle(args, options = {}) {
  return runWindowsCommand(BUNDLE, args, options);
}

function runNpm(args, options = {}) {
  return runWindowsCommand(NPM, args, options);
}

function assertNoArgs(args) {
  if (args.length) throw new Error(`PARAMETRO_INVALIDO:${args[0]}`);
}

function safePath(value) {
  const candidate = path.resolve(ROOT_DIR, value || ".");
  if (candidate !== ROOT_DIR && !candidate.startsWith(`${ROOT_DIR}${path.sep}`)) throw new Error(`PATH_INSEGURO:${value}`);
  return candidate;
}

function readFileSlice(args, direction) {
  const target = safePath(args[0] || "README.md");
  const count = Number(args[1] || 50);
  if (!Number.isInteger(count) || count < 1 || count > 200) throw new Error("PARAMETRO_INVALIDO:linhas");
  const lines = fs.readFileSync(target, "utf8").split(/\r?\n/u);
  return result(0, (direction === "tail" ? lines.slice(-count) : lines.slice(0, count)).join("\n"));
}

function status() {
  const scripts = packageScripts().sort();
  const available = new Set([
    "agent:filter", "agent:setup", "agent:doctor", "agent:status", "agent:context", "agent:workspace", "agent:agents",
    "agent:pwd", "agent:ls", "agent:tree", "agent:find", "agent:search", "agent:grep", "agent:head",
    "agent:tail", "agent:view", "agent:stat", "agent:size", "agent:hash", "agent:diff-file", "agent:handoff",
    "agent:compress", "agent:git-status", "agent:git-branch", "agent:git-tag", "agent:git-log", "agent:git-show",
    "agent:git-history", "agent:git-diff", "agent:git-blame", "agent:build", "agent:verify", "agent:test",
    "agent:lint", "agent:typecheck", "agent:deps", "agent:map", "agent:docs", "agent:rcf", "agent:analyze",
  ]);
  const commands = scripts.map((command) => ({
    command,
    status: available.has(command) ? "available" : NA_REASONS[command] ? "n/a" : "degraded",
    reason: NA_REASONS[command] || "contrato local disponível",
  }));
  const branch = run("git", ["branch", "--show-current"]);
  return result(0, JSON.stringify({ branch: branch.stdout.trim(), commands, root: ".", schema: 1 }));
}

function setup() {
  assertRequired(["AGENTS.md", "RCF.md", ".agents/continue.ia", "package.json", "scripts/.agents/to-ia.js"]);
  return result(0, JSON.stringify({ code: "SETUP_OK", node: process.version, packageManager: "npm", runtime: "Jekyll" }));
}

function doctor() {
  const required = ["AGENTS.md", "RCF.md", ".agents/continue.ia", "package.json", "scripts/.agents/to-ia.js"];
  const missing = required.filter((entry) => !fs.existsSync(path.join(ROOT_DIR, entry)));
  const git = run("git", ["status", "--short"]);
  return result(missing.length ? 4 : 0, JSON.stringify({ code: missing.length ? "DOCTOR_NONCOMPLIANT" : "DOCTOR_OK", missing, dirty: Boolean(git.stdout.trim()) }));
}

function context() {
  const active = fs.readFileSync(CONTINUE_PATH, "utf8").split(/\r?\n/u).filter((line) => /^FT-\d+\|.*\|status=(?!concluído)/u.test(line));
  const branch = run("git", ["branch", "--show-current"]);
  return result(0, JSON.stringify({ active, branch: branch.stdout.trim(), canonical: ".agents/continue.ia" }));
}

function workspace() {
  const git = run("git", ["status", "--short"]);
  return result(0, JSON.stringify({ files: run("git", ["ls-files"]).stdout.split(/\r?\n/u).filter(Boolean).slice(0, 200), status: git.stdout.split(/\r?\n/u).filter(Boolean) }));
}

function handoff() {
  return run(process.execPath, [path.join(ROOT_DIR, "scripts", ".agents", "generate-agents-status.js")]);
}

function build() {
  return runBundle(["exec", "ruby", "scripts/jekyll_local.rb", "build", "--destination", "tmp/agent-build"], { timeout: 900000 });
}

function verify() {
  return runNpm(["run", "check"], { timeout: 900000 });
}

function lint() {
  const files = listScripts(path.join(ROOT_DIR, "scripts"));
  for (const filePath of files) {
    const checked = run(process.execPath, ["--check", filePath]);
    if (checked.exit) return checked;
  }
  return result(0, JSON.stringify({ code: "LINT_OK", files: files.length }));
}

function deps() {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8"));
  return result(0, JSON.stringify({ dependencies: pkg.dependencies || {}, devDependencies: pkg.devDependencies || {} }));
}

function update(args) {
  return run(process.execPath, [path.join(ROOT_DIR, "scripts", ".agents", "update-agents.js"), ...args], { timeout: 120000 });
}

function readOperation(command, args) {
  if (command === "agent:pwd") { assertNoArgs(args); return result(0, ROOT_DIR); }
  if (command === "agent:ls" || command === "agent:tree") { assertNoArgs(args); return run("git", ["ls-files"]); }
  if (command === "agent:find") return run("git", ["ls-files", ...args]);
  if (command === "agent:search" || command === "agent:grep") return args.length ? run("git", ["grep", "-n", "--", ...args]) : result(2, "", "PARAMETRO_NORMATIVO_AUSENTE:padrao");
  if (command === "agent:head" || command === "agent:view") return readFileSlice(args, "head");
  if (command === "agent:tail") return readFileSlice(args, "tail");
  if (command === "agent:stat" || command === "agent:size") { const target = safePath(args[0] || "."); const stat = fs.statSync(target); return result(0, JSON.stringify({ path: path.relative(ROOT_DIR, target) || ".", size: stat.size, mtime: stat.mtime.toISOString() })); }
  if (command === "agent:hash") { const target = safePath(args[0] || "README.md"); return result(0, crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex")); }
  if (command === "agent:diff-file") return args.length ? run("git", ["diff", "--", ...args]) : result(2, "", "PARAMETRO_NORMATIVO_AUSENTE:arquivo");
  const git = {
    "agent:git-status": ["status", "--short"], "agent:git-branch": ["branch", "--list"], "agent:git-tag": ["tag", "--list"],
    "agent:git-log": ["log", "--oneline", "-20"], "agent:git-show": ["show", "--stat", "--oneline", args[0] || "HEAD"],
    "agent:git-history": ["log", "--oneline", "-50"], "agent:git-diff": ["diff", "--stat", ...args], "agent:git-blame": ["blame", "--", args[0] || "README.md"],
  };
  return git[command] ? run("git", git[command]) : null;
}

function assertRequired(entries) {
  const missing = entries.filter((entry) => !fs.existsSync(path.join(ROOT_DIR, entry)));
  if (missing.length) throw new Error(`ARQUIVO_AUSENTE:${missing.join(",")}`);
}

function listScripts(dirPath) {
  return fs.readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dirPath, entry.name);
    return entry.isDirectory() ? listScripts(target) : /\.(?:js|cjs|mjs)$/u.test(entry.name) ? [target] : [];
  });
}

function dispatch(command, args) {
  if (args.includes("--help") && command !== "agent:agents") return result(0, help());
  if (command === "agent:status") { assertNoArgs(args); return status(); }
  if (command === "agent:setup") { assertNoArgs(args); return setup(); }
  if (command === "agent:doctor") { assertNoArgs(args); return doctor(); }
  if (command === "agent:context") { assertNoArgs(args); return context(); }
  if (command === "agent:workspace") { assertNoArgs(args); return workspace(); }
  if (command === "agent:handoff" || command === "agent:compress") { assertNoArgs(args); return handoff(); }
  if (command === "agent:build") { assertNoArgs(args); return build(); }
  if (command === "agent:verify" || command === "agent:test" || command === "agent:analyze") { assertNoArgs(args); return verify(); }
  if (command === "agent:lint") { assertNoArgs(args); return lint(); }
  if (command === "agent:typecheck") { assertNoArgs(args); return runNpm(["run", "check:ts"]); }
  if (command === "agent:deps") { assertNoArgs(args); return deps(); }
  if (command === "agent:map") { assertNoArgs(args); return result(0, JSON.stringify({ normative: ["AGENTS.md", "RCF.md", ".agents/agents.local.md", ".agents/continue.ia"] })); }
  if (command === "agent:docs") { assertNoArgs(args); return result(0, "README.md\nRCF.md\nAGENTS.md\n.agents/agents.local.md"); }
  if (command === "agent:rcf") { assertNoArgs(args); return fs.existsSync(path.join(ROOT_DIR, "RCF.md")) ? result(0, "RCF_OK") : result(4, "", "RCF_AUSENTE"); }
  if (command === "agent:agents") return update(args);
  const read = readOperation(command, args);
  if (read) return read;
  if (NA_REASONS[command]) return result(3, "", `N_A:${NA_REASONS[command]}`);
  return result(2, "", `PARAMETRO_INVALIDO:comando=${command || "(vazio)"}`);
}

function help() {
  return "Uso: agent:<comando> [argumentos]. --help não altera estado; comandos n/a retornam 3; parâmetro inválido retorna 2.\n";
}

if (require.main === module) {
  const [command = "agent:status", ...args] = process.argv.slice(2);
  try {
    const output = command === "--help" ? result(0, help()) : dispatch(command, args);
    process.stdout.write(filterOutput({ command, ...output }));
    process.exitCode = output.exit;
  } catch (error) {
    process.stdout.write(filterOutput({ command, exit: 2, stderr: error.message }));
    process.exitCode = 2;
  }
}

module.exports = { dispatch, listScripts, safePath, status };
