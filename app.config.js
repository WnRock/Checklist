const CHECKLIST_BUILD_VERSION = process.env.CHECKLIST_BUILD_VERSION || "0.0.0";
const CHECKLIST_BUILD_ARCH = process.env.CHECKLIST_BUILD_ARCH || "universal";

const buildVersion = CHECKLIST_BUILD_VERSION;
const buildArch =
  CHECKLIST_BUILD_ARCH !== "universal"
    ? [CHECKLIST_BUILD_ARCH]
    : ["armeabi-v7a", "arm64-v8a", "x86", "x86_64"];

module.exports = {
  expo: {
    name: "Checklist",
    slug: "Checklist",
    version: buildVersion,
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "checklist",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "dev.wnrock.checklist",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "dev.wnrock.checklist",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            buildArchs: buildArch,
          },
        },
      ],
      "expo-font",
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "b663614a-67f1-4ee5-8ddd-457898a005e8",
      },
    },
    owner: "wnrock",
  },
};
