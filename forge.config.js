const fs = require("fs");
const jszip = require("jszip");
const crypto = require("crypto");
const path = require("path");

const date = new Date().toISOString();

const findBuildFile = (outputPath) => {
  const linuxPath = path.join(outputPath, "resources", "app", "build.json");
  if (fs.existsSync(path.dirname(linuxPath))) {
    return linuxPath;
  }

  const appBundle = fs.readdirSync(outputPath).find((entry) => entry.endsWith(".app"));
  if (appBundle) {
    const macPath = path.join(outputPath, appBundle, "Contents", "Resources", "app", "build.json");
    if (fs.existsSync(path.dirname(macPath))) {
      return macPath;
    }
  }

  throw new Error(`Unable to locate packaged application resources in ${outputPath}`);
};

const generateBuildFile = (platform, arch, maker) => {
  const package = fs.readFileSync(path.join(__dirname, "package.json"), "utf8");
  const hash = crypto.createHash("sha256").update(package);
  const data = {
    id: hash.digest("hex").slice(-6),
    platform: platform,
    arch: arch,
    maker: maker,
    date: date,
  };
  return JSON.stringify(data, null, 2);
};

module.exports = {
  packagerConfig: {
    ignore: [".github", ".gitignore", "deploy", "docs", "install.sh", "forge.config.js"],
  },
  makers: [
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          productName: "Simply Home",
          productDescription: "Kiosk mode application for a Home Assistant dashboard",
          categories: ["Network"],
          icon: "img/icon.png",
        },
      },
    },
    {
      name: "@electron-forge/maker-zip",
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "dushyantgithub",
          name: "simply-home",
        },
        draft: false,
      },
    },
  ],
  hooks: {
    postPackage: async (config, results) => {
      for (const outputPath of results.outputPaths) {
        const buildFile = findBuildFile(outputPath);
        fs.writeFileSync(buildFile, generateBuildFile(results.platform, results.arch, "deb"), { encoding: "utf8" });
      }
    },
    postMake: async (config, results) => {
      for (const result of results) {
        const artifacts = [];
        for (const artifact of result.artifacts) {
          if (artifact.includes(".zip")) {
            const options = { type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 9 } };
            const zip = await jszip.loadAsync(fs.readFileSync(artifact));
            const appRoot = Object.keys(zip.files).find((entry) => /\/(?:Resources|resources)\/app\/$/.test(entry));
            if (!appRoot) {
              throw new Error(`Unable to locate application resources in ${artifact}`);
            }
            const buildFile = `${appRoot}build.json`;
            zip.file(buildFile, generateBuildFile(result.platform, result.arch, "zip"));
            fs.writeFileSync(artifact, await zip.generateAsync(options));
          }
          if (artifact.includes("amd64")) {
            const renamed = artifact.replace("amd64", "x64");
            fs.renameSync(artifact, renamed);
            artifacts.push(renamed);
          } else {
            artifacts.push(artifact);
          }
        }
        result.artifacts = artifacts;
      }
    },
  },
};
