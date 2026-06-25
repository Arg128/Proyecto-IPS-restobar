const fs = require("fs");
const path = require("path");

const apps = [
  { src: "admin-frontend", dest: "admin" },
  { src: "cocina-frontend", dest: "cocina" },
  { src: "caja-frontend", dest: "caja" },
  { src: "delivery-frontend", dest: "delivery" },
];

async function copyRecursive(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyRecursive(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  await fs.promises.rm("dist", { recursive: true, force: true });
  await fs.promises.mkdir("dist", { recursive: true });
  for (const app of apps) {
    const buildDir = path.join("apps", app.src, "build");
    const destDir = path.join("dist", app.dest);
    try {
      await fs.promises.access(buildDir);
      await copyRecursive(buildDir, destDir);
      console.log(`✓ ${buildDir} → ${destDir}`);
    } catch {
      console.warn(`⚠ Build directory not found: ${buildDir}`);
    }
  }
}
main().catch((err) => {
  console.error("Error assembling builds:", err);
  process.exit(1);
});
