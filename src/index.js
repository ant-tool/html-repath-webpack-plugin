import { join, normalize, parse, relative, dirname } from 'path';
import isRelative from 'is-relative';
import glob from 'glob';
import { readFileSync } from 'fs';

import { fixAssetsInHtml, isValidExpression, isValidReplace } from './util';

export default class HtmlRepath {

  static defaults = {
    regx: '',
    replace: '',
    cwd: process.cwd(),
    ignore: '',
    xFixAssets: false,
    hash: false,
    forceRelative: false,
  };

  constructor(options) {
    this.options = { ...HtmlRepath.defaults, ...options };
  }

  apply(compiler) {
    const context = normalize(compiler.context);
    let outputPath = normalize(compiler.options.output.path);
    outputPath = isRelative(outputPath) ? join(context, outputPath) : outputPath;
    compiler.plugin('emit', (compilation, callback) => {
      const opts = this.options;

      if (!isValidExpression(opts.regx) || !isValidReplace(opts.replace)) {
        return;
      }
      const globOpts = {
        cwd: opts.cwd,
        ignore: opts.ignore,
        nodir: true,
      };
      const assets = compilation.assets;
      let map = {};
      if (opts.hash) {
        map = Object.keys(assets).reduce((prev, item) => {
          const _prev = prev;
          const pathInfo = parse(item);
          const spInfo = pathInfo.name.split('-');
          const extname = pathInfo.ext;
          const hash = spInfo[1];
          const name = spInfo[0];
          _prev[name + extname] = hash;

          return _prev;
        }, {});
      }
      const htmlFiles = glob.sync('**/*.html', globOpts);
      htmlFiles.forEach((htmlFileName) => {
        const regxAfterName = normalize(htmlFileName.replace(opts.regx, opts.replace));
        const fileName = opts.regx ? regxAfterName : htmlFileName;
        let htmlContent = readFileSync(join(opts.cwd, htmlFileName), 'utf8');
        // html路径变更后需要修改 html 内资源文件的引用路径
        // 1.路径不修复 例如使用 publicPath
        // 2.路径修复
        // hash 作为独立项处理
        let fixSourceRelativePath = false;
        if (!opts.xFixAssets) {
          fixSourceRelativePath = relative(dirname(join(outputPath, regxAfterName)), outputPath);
        }
        htmlContent = fixAssetsInHtml(
          htmlContent,
          fixSourceRelativePath,
          map,
          opts.hash,
          opts.forceRelative
        );
        assets[fileName] = {
          source: () => htmlContent,
          size: () => Buffer.byteLength(htmlContent, 'utf8'),
        };
      });

      callback();
    });
  }
}
