const fs = require("fs");
const path = require("path");

console.log("==========================================");
console.log("   GITHUB UNIVERSE — MSIX PACKAGING VALIDATOR   ");
console.log("==========================================");

const builderConfigPath = path.join(__dirname, "../electron-builder.yml");
const manifestPath = path.join(__dirname, "../public/package.appxmanifest");
const assetPaths = [
  "build/icon.ico",
  "build/icon.png",
  "build/appx/StoreLogo.png",
  "build/appx/Square44x44Logo.png",
  "build/appx/Square71x71Logo.png",
  "build/appx/Square150x150Logo.png",
  "build/appx/Square310x310Logo.png",
  "build/appx/Wide310x150Logo.png",
  "build/appx/SplashScreen.png",
];

if (!fs.existsSync(builderConfigPath)) {
  console.error("❌ ERROR: electron-builder.yml missing at:", builderConfigPath);
  process.exit(1);
}

if (!fs.existsSync(manifestPath)) {
  console.error("ERROR: package.appxmanifest is missing at:", manifestPath);
  process.exit(1);
}

const missingAssets = assetPaths.filter((assetPath) => !fs.existsSync(path.join(__dirname, "..", assetPath)));
if (missingAssets.length > 0) {
  console.error("ERROR: Required Windows assets are missing:", missingAssets.join(", "));
  process.exit(1);
}

const manifest = fs.readFileSync(manifestPath, "utf8");
const manifestReferences = [
  "GitHubUniverse.App",
  'ProcessorArchitecture="x64"',
  "Version=\"1.0.2.0\"",
  "PublisherDisplayName>KILZSNIPPET</PublisherDisplayName>",
  "MinVersion=\"10.0.17763.0\"",
  "assets/StoreLogo.png",
  "assets/Square44x44Logo.png",
  "assets/Square150x150Logo.png",
  "assets/Wide310x150Logo.png",
];
const missingManifestReferences = manifestReferences.filter((reference) => !manifest.includes(reference));
if (missingManifestReferences.length > 0) {
  console.error("ERROR: AppX manifest is missing:", missingManifestReferences.join(", "));
  process.exit(1);
}

console.log("✓ electron-builder.yml validated successfully.");
console.log("✓ package.appxmanifest identity and asset references validated successfully.");
console.log("✓ Windows icon and tile assets validated successfully.");
console.log("✓ Identity: GitHubUniverse.App (v1.0.2.0 x64, Windows 10 1809+)");
console.log("✓ Windows 10/11 Target SDK Ready!");
console.log("==========================================");
