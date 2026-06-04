import fs from "node:fs";
import path from "node:path";

const dist = path.resolve(import.meta.dirname, "..", "dist");
const serverAssets = path.join(dist, "server", "assets");
const workerAssets = path.join(dist, "look_app", "assets");

if (!fs.existsSync(serverAssets)) {
  console.log("[copy-manifest] server assets not found, skipping");
  process.exit(0);
}
if (!fs.existsSync(workerAssets)) {
  console.log("[copy-manifest] worker assets not found, skipping");
  process.exit(0);
}

const serverManifest = fs
  .readdirSync(serverAssets)
  .find((f) => f.startsWith("_tanstack-start-manifest_v-"));
const workerManifest = fs
  .readdirSync(workerAssets)
  .find((f) => f.startsWith("_tanstack-start-manifest_v-"));

if (!serverManifest || !workerManifest) {
  console.log("[copy-manifest] manifest not found in one or both directories, skipping");
  process.exit(0);
}

const src = fs.readFileSync(path.join(serverAssets, serverManifest), "utf-8");
fs.writeFileSync(path.join(workerAssets, workerManifest), src);
console.log("[copy-manifest] replaced empty worker manifest with production manifest");
