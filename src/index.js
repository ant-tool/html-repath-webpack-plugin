import { join, normalize, sep } from 'path';
import glob from 'glob';
import { readFileSync } from 'fs';

import { fixAssetsInHtml, isValidExpression } from './util';

export default class HtmlRepath {

  static defaults = {
    regx: '',
    replace: '',
    cwd: process.cwd(),
    ignore: '',
  };

  constructor(options) {
    this.options = { ...HtmlRepath.defaults, ...options };
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const opts = this.options;
      if (opts.regx) {
        isValidExpression(opts.regx);
      }

      const globOpts = {
        cwd: opts.cwd,
        ignore: opts.ignore,
        nodir: true,
      };
      const htmlFiles = glob.sync('**/*.html', globOpts);
      htmlFiles.forEach((htmlFileName) => {
        const regxAfterName = htmlFileName.replace(opts.regx, opts.replace);
        const fileName = opts.regx ? normalize(regxAfterName) : htmlFileName;
        const dirHierarchy = fileName.split(sep).length - 1;
        const fixSourceRelativePath = '../'.repeat(dirHierarchy);
        const htmlContent = readFileSync(join(opts.cwd, htmlFileName), 'utf8');
        const fixHtmlContent = fixAssetsInHtml(htmlContent, fixSourceRelativePath);
        const assets = compilation.assets;
        assets[fileName] = {
          source: () => fixHtmlContent,
          size: () => Buffer.byteLength(fixHtmlContent, 'utf8'),
        };
      });

      callback();
    });
  }
}
