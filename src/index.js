import path from 'path'

export default class HtmlRepath {
  static defaults = {
  };

  constructor(options) {
    this.options = { ...HtmlRepath.defaults, ...options }
  };

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {

    });
  }
}