import assert from 'assert';
import { handlerSwitch } from '../handler';
import { AnyErrors } from '../type/errors';
import { AttrPath } from '../utils'

describe('any handler', () => {
  const path = new AttrPath();
  it('allow null, provide null', () => {
    assert.strictEqual(handlerSwitch(null, {
      type: 'any',
      allowNull: true
    }, path), null);
  });

  it('do not allow null, provide null', () => {
    assert.strictEqual(handlerSwitch(null, {
      type: 'any',
      allowNull: false
    }, path), `${path.join()} ${AnyErrors.DO_NOT_ALLOW_NULL}`);
  });

});