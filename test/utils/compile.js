import { join } from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const srcDir = join(__dirname, '..', 'fixtures');

process.chdir(srcDir);

const outDir = join(__dirname, '..', 'tmp');

export default (plugin, hash, done) => {
  const config = {
    context: srcDir,
    entry: {
      index: './src/gear-1/index.js',
    },
    output: {
      path: outDir,
      filename: hash ? '[name]-578184e8fb4a630f824f.js' : '[name].js',
    },
    plugins: [
      plugin,
      hash ? new ExtractTextPlugin('[name]-578184e8fb4a630f824f.css', { allChunks: true }) :
             new ExtractTextPlugin('[name].css', { allChunks: true }),
    ],
    module: {
      loaders: [
        { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
      ],
    },
  };
  return webpack(config, (error, stats) => {
    if (error) throw error;
    const errors = stats.toJson().errors;
    if (errors.length) throw new Error(errors[0]);
    done();
  });
};
