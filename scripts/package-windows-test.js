const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "dist");
const certificatePath = path.join(projectRoot, "certs", "GitHubUniverse-Local-Test.pfx");
const certificatePassword = process.env.MSIX_CERT_PASSWORD;
const bundleDir = path.join(process.env.USERPROFILE || process.env.HOME, "Downloads", "GitHubUniverse-MSIX-Test");
const packageMetadata = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
const expectedMsix = `GitHubUniverse-${packageMetadata.version}-x64.msix`;

function findFile(root, fileName) {
  if (!fs.existsSync(root)) return null;
  const entries = fs.readdirSync(root, { withFileTypes: true }).sort((left, right) => {
    return Number(right.name.toLowerCase() === "x64") - Number(left.name.toLowerCase() === "x64");
  });
  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isFile() && entry.name.toLowerCase() === fileName.toLowerCase()) return entryPath;
    if (entry.isDirectory()) {
      const match = findFile(entryPath, fileName);
      if (match) return match;
    }
  }
  return null;
}

if (!fs.existsSync(certificatePath)) {
  throw new Error(`Signing certificate not found: ${certificatePath}`);
}
if (!certificatePassword) {
  throw new Error("Set MSIX_CERT_PASSWORD before creating the Windows test bundle.");
}

fs.mkdirSync(bundleDir, { recursive: true });
if (fs.existsSync(outputDir)) {
  for (const file of fs.readdirSync(outputDir)) {
    if (file.toLowerCase().endsWith(".msix")) fs.rmSync(path.join(outputDir, file), { force: true });
  }
}
execFileSync("npm.cmd", ["run", "build:msix"], {
  cwd: projectRoot,
  env: {
    ...process.env,
    ELECTRON_BUILDER_OFFLINE: "true",
    CSC_IDENTITY_AUTO_DISCOVERY: "false",
  },
  shell: true,
  stdio: "inherit",
});

if (!fs.existsSync(path.join(outputDir, expectedMsix))) {
  throw new Error(`Expected MSIX package was not produced: ${path.join(outputDir, expectedMsix)}`);
}
const msix = expectedMsix;

const sdkRoot = "C:\\Program Files (x86)\\Windows Kits\\10\\bin";
const sdkVersions = fs.existsSync(sdkRoot) ? fs.readdirSync(sdkRoot).sort().reverse() : [];
const sdkSignTool = sdkVersions
  .map((version) => path.join(sdkRoot, version, "x64", "signtool.exe"))
  .find((candidate) => fs.existsSync(candidate));
const signTool = sdkSignTool || findFile(path.join(process.env.LOCALAPPDATA || "", "electron-builder", "Cache"), "signtool.exe") || "signtool.exe";
execFileSync(signTool, ["sign", "/fd", "sha256", "/f", certificatePath, "/p", certificatePassword, path.join(outputDir, msix)], {
  cwd: projectRoot,
  stdio: "inherit",
});

const publicCertificatePath = path.join(bundleDir, "GitHubUniverse-Local.cer");
const sourceCertificatePath = path.join(projectRoot, "certs", "GitHubUniverse-Local-Test.cer");
if (!fs.existsSync(sourceCertificatePath)) {
  throw new Error(`Public certificate not found: ${sourceCertificatePath}`);
}
fs.copyFileSync(sourceCertificatePath, publicCertificatePath);

fs.copyFileSync(path.join(outputDir, msix), path.join(bundleDir, msix));
fs.copyFileSync(certificatePath, path.join(bundleDir, "GitHubUniverse-Local.pfx"));
fs.writeFileSync(
  path.join(bundleDir, "INSTALL-TEST-PACKAGE.md"),
  `# GitHub Universe local MSIX test package\n\n` +
    `1. Open **GitHubUniverse-Local.cer**, choose **Install Certificate**, select **Local Machine**, and place it in **Trusted People**.\n` +
    `2. Open PowerShell as Administrator in this folder.\n` +
    `3. Install the package with:\n\n` +
    `   Add-AppxPackage -Path .\\${msix}\n\n` +
    `The PFX password for this local test certificate is the value of MSIX_CERT_PASSWORD used during packaging. Do not distribute the PFX outside this test machine.\n`,
  "utf8"
);

console.log(`Windows test bundle created at: ${bundleDir}`);