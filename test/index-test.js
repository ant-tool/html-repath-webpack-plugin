import expect from 'expect.js';
import { join } from 'path';
import { readFileSync } from 'fs';
import rimraf from 'rimraf';
import compile from './utils/compile';
import HtmlRepathPlugin from '../src';
import { isValidExpression, isValidReplace, filesMap } from '../src/util';

const fixDir = join(__dirname, 'fixtures');
const expDir = join(__dirname, 'expect');
const tmpDir = join(__dirname, 'tmp');

describe('HtmlRepathPlugin', () => {
  before(() => {
    process.chdir(fixDir);
  });

  afterEach(done => {
    rimraf.sync(tmpDir);
    done();
  });

  it('with params: regx and replace', done => {
    compile(
      new HtmlRepathPlugin({
        regx: new RegExp(/(.+)\.html$/),
        replace: function r(i) {
          return i;
        },
      }), false, () => {
        const now = readFileSync(join(tmpDir, 'src/gear-1/index.html'), 'utf-8');
        const exp = readFileSync(join(expDir, 'without-param.html'), 'utf-8');
        expect(now).to.equal(exp);
        done();
      }
    );
  });

  it('with params: cwd, regx and replace', done => {
    compile(
      new HtmlRepathPlugin({
        cwd: join(fixDir, 'src'),
        regx: new RegExp(/(.+)\.html$/),
        replace: function r(i) {
          return i;
        },
      }), false, () => {
        const now = readFileSync(join(tmpDir, 'gear-1/index.html'), 'utf-8');
        const exp = readFileSync(join(expDir, 'with-param-cwd.html'), 'utf-8');
        expect(now).to.equal(exp);
        done();
      });
  });

  it('with params: cwd, regx and replace specified - x/x/x/', done => {
    compile(
      new HtmlRepathPlugin({
        cwd: join(fixDir, 'src'),
        regx: new RegExp(/(.+)\.html$/),
        replace: function r(i, match) {
          return i.replace(match, 'x/x/x/index');
        },
      }), false, () => {
        const now = readFileSync(join(tmpDir, 'x/x/x/index.html'), 'utf-8');
        const exp = readFileSync(join(expDir, 'with-params-cwd-regx-replace.html'), 'utf-8');
        expect(now).to.equal(exp);
        done();
      });
  });

  it('with params: cwd, regx, replace specified - x/x/x/ and hash', done => {
    compile(
      new HtmlRepathPlugin({
        cwd: join(fixDir, 'src'),
        regx: new RegExp(/(.+)\.html$/),
        replace: function r(i, match) {
          return i.replace(match, 'x/x/x/index');
        },
        hash: true,
      }), true, () => {
        const now = readFileSync(join(tmpDir, 'x/x/x/index.html'), 'utf-8');
        const exp = readFileSync(join(expDir, 'with-params-cwd-regx-replace-hash.html'), 'utf-8');
        expect(now).to.equal(exp);
        done();
      });
  });

  it('with params: cwd, regx, replace specified - x/x/x/, hash and xFixAssets', done => {
    compile(
      new HtmlRepathPlugin({
        cwd: join(fixDir, 'src'),
        regx: new RegExp(/(.+)\.html$/),
        replace: function r(i, match) {
          return i.replace(match, 'x/x/x/index');
        },
        hash: true,
        xFixAssets: true,
      }), true, () => {
        const now = readFileSync(join(tmpDir, 'x/x/x/index.html'), 'utf-8');
        const path = join(expDir, 'with-params-cwd-regx-replace-hash-xFixAssets.html');
        const exp = readFileSync(path, 'utf-8');
        expect(now).to.equal(exp);
        done();
      });
  });

  it('with params: cwd, regx, replace specified - x/x/x/, hash and forceRelative', done => {
    compile(
      new HtmlRepathPlugin({
        cwd: join(fixDir, 'src'),
        regx: new RegExp(/(.+)\.html$/),
        replace: function r(i, match) {
          return i.replace(match, 'x/x/x/index');
        },
        hash: true,
        xFixAssets: false,
        forceRelative: true,
      }), true, () => {
        const now = readFileSync(join(tmpDir, 'x/x/x/index.html'), 'utf-8');
        const path = join(expDir, 'with-params-cwd-regx-replace-hash-forceRelative.html');
        const exp = readFileSync(path, 'utf-8');
        expect(now).to.equal(exp);
        done();
      });
  });

  it('with params: hashFix', done => {
    // 需要补充更详细的用例
    compile(
      new HtmlRepathPlugin({
        hashFix: true,
        hash: true,
      }), true, () => {
        const now = readFileSync(join(tmpDir, 'x/x/x/index.html'), 'utf-8');
        const path = join(expDir, 'with-hashFix.html');
        const exp = readFileSync(path, 'utf-8');
        expect(now).to.equal(exp);
        done();
      });
    done();
  });

  it('util with invalid regx', done => {
    expect(isValidExpression).withArgs('*,djla$/').to.throwError();
    done();
  });

  it('util with invalid replace', done => {
    expect(isValidReplace).withArgs('*,djla$/').to.throwError();
    done();
  });

  it('util with filesMap', done => {
    const arg = {
      'test-abc.js': {},
      'check-abc.css': {},
      'aaa.html': '',
    };
    expect(filesMap('')).to.eql({});
    const result = expect(filesMap(arg));
    result.to.have.property('test.js', 'abc');
    done();
  });
});
