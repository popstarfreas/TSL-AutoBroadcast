import fs from "node:fs";
import child_process from "node:child_process";

child_process.execSync("pnpm i", { stdio: "inherit" })
child_process.execSync("pnpm remove terrariaserver-lite", { stdio: "inherit" })
child_process.execSync("pnpm add ../../", { stdio: "inherit" })
child_process.execSync("pnpm run build", { stdio: "inherit" })
fs.renameSync("./build", "./plugin")
