import { filsMap, fixAssetsInHtml } from './util';
function hashReplace(compiler) {
  compiler.plugin('compilation', (compilation) => {
    const assets = compilation.assets;
    let map = {};
    compilation.plugin('html-webpack-plugin-after-html-processing', (htmlData, callback) => {
      const htmlPluginData = htmlData;
      map = filsMap(assets);
      htmlPluginData.html = fixAssetsInHtml(htmlPluginData.html, '', map, true, false);
      callback(null, htmlPluginData);
    });
  });
}

export default hashReplace;
