# html-repath-webpack-plugin

[![NPM version](https://img.shields.io/npm/v/html-repath-webpack-plugin.svg?style=flat)](https://npmjs.org/package/html-repath-webpack-plugin)
[![Build Status](https://img.shields.io/travis/ant-tool/html-repath-webpack-plugin.svg?style=flat)](https://travis-ci.org/ant-tool/html-repath-webpack-plugin)
[![Coverage Status](https://img.shields.io/coveralls/ant-tool/html-repath-webpack-plugin.svg?style=flat)](https://coveralls.io/r/ant-tool/html-repath-webpack-plugin)
[![NPM downloads](http://img.shields.io/npm/dm/html-repath-webpack-plugin.svg?style=flat)](https://npmjs.org/package/html-repath-webpack-plugin)
[![Dependency Status](https://david-dm.org/ant-tool/html-repath-webpack-plugin.svg)](https://david-dm.org/ant-tool/html-repath-webpack-plugin)

Webpack plugin for generating html file with specified path

## Features
Generates html files with specified path

## Installation

```bash
$ npm i --save html-repath-webpack-plugin
```

## Usage

Add new plugin instance to your `webpack` config

```javascript
  import HtmlRepathPlugin from 'html-repath-webpack-plugin';

  const compiler = webpack({
    // ...
    plugins: [
      new HtmlRepathPlugin()
    ]
  });
```

## Configuration
The plugin accepts the following options:

- cwd: cwd
- regx: like 'src\/'
- replace: ''
- ignore: pass through to glob


### License
MIT