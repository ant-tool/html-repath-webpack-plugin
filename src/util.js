import { normalize, basename, join, parse } from 'path';
import isUrl from 'is-url';
import isRelative from 'is-relative';
import { load } from 'cheerio';

function fixSourcePath($, selector, attr, fixAssetsPath, map, hash) {
  $(selector).each(function () {
    let source = $(this).attr(attr);
    if (source && !isUrl(source) && isRelative(source)) {
      source = normalize(source);
      const baseName = basename(source);
      let newSourcePath;
      if (hash) {
        const parseInfo = parse(source);
        const hashInfo = map[baseName];
        const dir = fixAssetsPath === false ? parseInfo.dir : fixAssetsPath;
        newSourcePath = join(dir, `${parseInfo.name}-${hashInfo}${parseInfo.ext}`);
      } else {
        newSourcePath = fixAssetsPath === false ? source : join(fixAssetsPath, baseName);
      }
      $(this).attr(attr, newSourcePath);
    }
  });
}

export function fixAssetsInHtml(htmlContent, fixAssetsPath, map, hash) {
  const $ = load(htmlContent);

  fixSourcePath($, 'script', 'src', fixAssetsPath, map, hash);
  fixSourcePath($, 'link[rel=stylesheet]', 'href', fixAssetsPath, map, hash);

  return $.html();
}

export function isValidExpression(regx) {
  let isValid = false;
  if (regx instanceof RegExp) {
    isValid = true;
  } else {
    throw new Error(`${regx}, regx must be a regular expression`);
  }

  return isValid;
}

export function isValidReplace(replace) {
  let isValid = false;
  if (typeof(replace) === 'function') {
    isValid = true;
  } else {
    throw new Error(`${replace}, replace must be a function`);
  }

  return isValid;
}
