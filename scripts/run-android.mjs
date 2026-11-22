import { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const executable = (directory, name) => path.join(directory, "bin", isWindows ? `${name}.exe` : name);

function firstExisting(candidates, marker) {
  return candidates.find((candidate) => candidate && existsSync(marker(candidate)));
}

const javaHome = firstExisting([
  process.env.JAVA_HOME,
  process.platform === "darwin" ? "/Applications/Android Studio.app/Contents/jbr/Contents/Home" : undefined,
  process.platform === "linux" ? "/opt/android-studio/jbr" : undefined,
  isWindows && process.env.ProgramFiles ? path.join(process.env.ProgramFiles, "Android", "Android Studio", "jbr") : undefined,
], (candidate) => executable(candidate, "java"));

const androidHome = firstExisting([
  process.env.ANDROID_HOME,
  process.env.ANDROID_SDK_ROOT,
  process.platform === "darwin" ? path.join(homedir(), "Library", "Android", "sdk") : undefined,
  process.platform === "linux" ? path.join(homedir(), "Android", "Sdk") : undefined,
  isWindows && process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "Android", "Sdk") : undefined,
], (candidate) => path.join(candidate, "platform-tools"));

if (!javaHome) {
  console.error("Java was not found. Install Android Studio or set JAVA_HOME to a compatible JDK.");
  process.exit(1);
}

if (!androidHome) {
  console.error("The Android SDK was not found. Install it in Android Studio or set ANDROID_HOME.");
  process.exit(1);
}

const env = {
  ...process.env,
  JAVA_HOME: javaHome,
  ANDROID_HOME: androidHome,
  ANDROID_SDK_ROOT: androidHome,
  PATH: [
    path.join(javaHome, "bin"),
    path.join(androidHome, "platform-tools"),
    path.join(androidHome, "emulator"),
    process.env.PATH ?? "",
  ].join(path.delimiter),
};

const args = process.argv.slice(2);
if (args.includes("--diagnose")) {
  console.log(`JAVA_HOME=${javaHome}`);
  console.log(`ANDROID_HOME=${androidHome}`);
  process.exit(0);
}

const expo = path.join(process.cwd(), "node_modules", ".bin", isWindows ? "expo.cmd" : "expo");
if (!existsSync(expo)) {
  console.error("Expo is not installed locally. Run npm install first.");
  process.exit(1);
}

const child = spawn(expo, ["run:android", ...args], { env, stdio: "inherit" });
child.on("error", (error) => {
  console.error(`Unable to start Expo: ${error.message}`);
  process.exit(1);
});
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
