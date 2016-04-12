import { normalize, basename } from 'path';
import isUrl from 'is-url';
import isRelative from 'is-relative';
import { load } from 'cheerio';

function fixSourcePath($, selector, attr, fixSourceRelativePath) {
  $(selector).each(function () {
    let source = $(this).attr(attr);
    if (source && !isUrl(source) && isRelative(source)) {
      source = normalize(source);
      const newSourcePath = fixSourceRelativePath + basename(source);
      $(this).attr(attr, newSourcePath);
    }
  });
}

export function fixAssetsInHtml(htmlContent, fixSourceRelativePath) {
  const $ = load(htmlContent);

  fixSourcePath($, 'script', 'src', fixSourceRelativePath);
  fixSourcePath($, 'link[rel=stylesheet]', 'href', fixSourceRelativePath);

  return $.html();
}
