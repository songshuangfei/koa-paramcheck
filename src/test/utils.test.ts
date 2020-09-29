import * as utils from '../utils';
import assert from 'assert';
import { QueryRule } from '../type/rules';

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

  it('utils.queryObjectToJSON', () => {
    const rule: QueryRule = {
      properties: {
        nums: {
          type: 'simpleArray',
          itemRule: {
            type: "number",
            max: 10,
            min: 0
          },
          allowEmpty: true
        },
        name: { type: 'string', pattern: /[a-z]+/ },
        bool: { type: 'boolean' },
        age: { type: 'number' }
      }
    };

    const wrongData = {
      nums: '123',
      name: 'ddd',
      bool: '222',
      age: 'ddh'
    };

    const rightData = {
      nums: ['1', '2', 'asd'],
      name: '312',
      bool: 'true',
      age: '23'
    };

    const res = utils.queryObjectToJSON(rule, wrongData);
    assert.strictEqual(JSON.stringify(res), JSON.stringify({
      nums: [123],
      name: 'ddd',
      bool: '222',
      age: 'ddh'
    }));

    const res1 = utils.queryObjectToJSON(rule, { nums: 'sdf' });
    assert.strictEqual(JSON.stringify(res1), JSON.stringify({ nums: ['sdf'] }));

    const res2 = utils.queryObjectToJSON(rule, rightData);
    assert.strictEqual(JSON.stringify(res2), JSON.stringify({
      nums: [1, 2, 'asd'],
      name: '312',
      bool: true,
      age: 23
    }));
  });

});