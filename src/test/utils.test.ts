import * as utils from '../utils';
import assert from 'assert';

describe('utils', () => {
  it('utils.removeStrSpace', () => {
    assert.strictEqual(utils.removeStrSpace(' 2 2  2  '), '222');
  });

  it('utils.isObject', () => {
    assert.strictEqual(utils.isObject(null), false);
    assert.strictEqual(utils.isObject([]), false);
    assert.strictEqual(utils.isObject({}), true);
    assert.strictEqual(utils.isObject(1), false);
  });

  it('utils.AttrPath', () => {
    const attrPath = new utils.AttrPath();
    attrPath.push(1).push('x');
    assert.strictEqual(attrPath.join(), '[1].x');
    assert.strictEqual(attrPath.clone().push('y').join(), '[1].x.y');
    assert.strictEqual(attrPath.join(), '[1].x');
  });

});