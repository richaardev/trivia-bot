/* eslint-disable import/no-extraneous-dependencies */
import { join, resolve } from "path";
import { fileURLToPath } from "url";

import { build } from "esbuild";
import FastGlob from "fast-glob";
import { resolveTsPaths } from "resolve-tspaths";

(async () => {
  const basePath = resolve(fileURLToPath(import.meta.url), "../");

  await build({
    outdir: "dist",
    tsconfig: "tsconfig.json",
    absWorkingDir: basePath,
    entryPoints: FastGlob.sync("src/**/*.ts"),
    drop: ["console"],
    logLevel: "info",
  });

  await resolveTsPaths({
    project: join(basePath, "tsconfig.json"),
  });
})();
