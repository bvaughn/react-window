import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

const config: Config = {
  // https://vike.dev/head-tags
  title: "[Vike] react-window integration",
  description: "Test harness",
  htmlAttributes: { class: "dark bg-black text-white" },
  extends: [vikeReact]
};

export default config;
