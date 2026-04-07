import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");

const pkgJson = JSON.parse(await readFile(resolve(rootDir, "package.json"), "utf-8"));

const c = {
  pkg: {
    name: pkgJson.name,
    version: pkgJson.version,
  },
  path: {
    package: rootDir,
    tsconfig: resolve(rootDir, "tsconfig.json"),
    swcrc: resolve(rootDir, ".swcrc"),
    dist: resolve(rootDir, "dist"),
  }
}

const run = (command: string, args: string[], cwd: string) =>
  new Promise<void>((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`[BUILD] Command succeeded: ${command} ${args.join(" ")}`);
        resolvePromise();
        return;
      }

      rejectPromise(new Error(`[BUILD] Command failed (${code}): ${command} ${args.join(" ")}`));
    });

    child.on("error", (error) => {
      rejectPromise(error);
    });
  });

const buildPackage = async () => {
  if (!existsSync(c.path.package)) {
    throw new Error(`[BUILD] Package not found: ${c.pkg.name}`);
  }

  if (!existsSync(c.path.tsconfig)) {
    throw new Error(`[BUILD] tsconfig.json not found: ${c.pkg.name}`);
  }

  if (!existsSync(c.path.swcrc)) {
    throw new Error(`[BUILD] .swcrc not found: ${c.pkg.name}`);
  }

  await rm(c.path.dist, { recursive: true, force: true });

  console.log(`[BUILD] Building package: ${c.pkg.name}`);
  await run(
    "pnpm",
    ["exec", "swc", "src", "-d", "dist", "--strip-leading-paths", "--config-file", ".swcrc"],
    c.path.package
  );

  console.log(`[BUILD] Generating type declarations for package: ${c.pkg.name}`);
  await run(
    "pnpm",
    [
      "exec",
      "tsc",
      "--project",
      "tsconfig.json",
      "--emitDeclarationOnly",
      "--declaration",
      "--outDir",
      "dist",
    ],
    c.path.package
  );
}

const main = async () => {
  await buildPackage();

  console.log(`

> Build completed successfully

name: ${c.pkg.name}
version: ${c.pkg.version}

`);
}

main().catch((error) => {
  console.error(`[BUILD] Build failed for package: ${c.pkg.name}`);
  console.error(error);
  process.exit(1);
});