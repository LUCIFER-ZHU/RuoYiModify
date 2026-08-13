import vue from "@vitejs/plugin-vue";

import createAutoImport from "./auto-import";
import createVueComponents from "./vue-components";
import createSvgIcon from "./svg-icon";
import createCompression from "./compression";
import createSetupExtend from "./setup-extend";

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue()];
  vitePlugins.push(createAutoImport());
  // unplugin-vue-components 必须在 createAutoImport 之后注册
  vitePlugins.push(createVueComponents());
  vitePlugins.push(createSetupExtend());
  vitePlugins.push(createSvgIcon(isBuild));
  isBuild && vitePlugins.push(...createCompression(viteEnv));
  return vitePlugins;
}
