import expect from 'expect.js';
import { join } from 'path';
import { readFileSync } from 'fs';
import rimraf from 'rimraf';
import compile from './utils/compile';
import HtmlRepathPlugin from '../src';
import { isValidExpression } from '../src/util';

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

  it('without param', done => {
    compile(
      new HtmlRepathPlugin(), () => {
        const now = readFileSync(join(tmpDir, 'src/gear-1/index.html'), 'utf-8');
        const exp = readFileSync(join(expDir, 'without-param.html'), 'utf-8');
        expect(now).to.equal(exp);
        done();
      }
    );
  });

  it('with param cwd', done => {
    compile(
      new HtmlRepathPlugin({
        cwd: join(fixDir, 'src'),
      }), () => {
      const now = readFileSync(join(tmpDir, 'gear-1/index.html'), 'utf-8');
      const exp = readFileSync(join(expDir, 'with-param-cwd.html'), 'utf-8');
      expect(now).to.equal(exp);
      done();
    });
  });

  it('with params cwd and regx and replace', done => {
    compile(
      new HtmlRepathPlugin({
        cwd: join(fixDir, 'src'),
        regx: 'gear\-1',
        replace: 'x/x/x',
      }), () => {
      const now = readFileSync(join(tmpDir, 'x/x/x/index.html'), 'utf-8');
      const exp = readFileSync(join(expDir, 'with-params-cwd-regx-replace.html'), 'utf-8');
      expect(now).to.equal(exp);
      done();
    });
  });

  it('util with invalid regx', done => {
    expect(isValidExpression).withArgs('*,djla$/').to.throwError();
    done();
  });
});
