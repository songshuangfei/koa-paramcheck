import assert from 'assert';
import { handlerSwitch } from '../handler';
import { ArrayErrors, StringErrors } from '../type/errors';
import { AttrPath } from '../utils'

describe('array handler', () => {
  const path = new AttrPath();
  it('allow null, provide null', () => {
    assert.strictEqual(handlerSwitch(null, {
      type: 'array',
      itemRule: { type: 'string' },
      allowNull: true
    }, path), null);
  });

  it('do not allow null, provide null', () => {
    assert.strictEqual(handlerSwitch(null, {
      type: 'array',
      itemRule: { type: 'string' },
      allowNull: false
    }, path), `${path.join()} ${ArrayErrors.DO_NOT_ALLOW_NULL}`);
  });

  it('provide not-array', () => {
    assert.strictEqual(handlerSwitch(1, {
      type: 'array',
      itemRule: { type: 'string' },
      allowNull: false
    }, path), `${path.join()} ${ArrayErrors.NOT_AN_ARRAY}`);
  });

  it('do not allow empty, provide empty', () => {
    assert.strictEqual(handlerSwitch([], {
      type: 'array',
      itemRule: { type: 'string' },
      allowNull: false,
      allowEmpty: false
    }, path), `${path.join()} ${ArrayErrors.DO_NOT_ALLOW_EMPTY}`);
  });

  it('provide wrong item', () => {
    assert.strictEqual(handlerSwitch([1, '2', 3, null], {
      type: 'array',
      itemRule: { type: 'string', allowNull: false },
      allowNull: false,
      allowEmpty: false
    }, path), `[0] ${StringErrors.NOT_A_STRING}; ` +
    `[2] ${StringErrors.NOT_A_STRING}; ` +
    `[3] ${StringErrors.DO_NOT_ALLOW_NULL}`
    );
  });

});