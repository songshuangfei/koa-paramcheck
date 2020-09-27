import assert from 'assert';
import { handlerSwitch } from '../handler';
import { BoolErrors } from '../type/errors';
import { AttrPath } from '../utils'

describe('boolean handler', () => {
  const path = new AttrPath();
  it('allow null, provide null', () => {
    assert.strictEqual(handlerSwitch(null, {
      type: 'boolean',
      allowNull: true
    }, path), null);
  });

  it('do not allow null, provide null', () => {
    assert.strictEqual(handlerSwitch(null, {
      type: 'boolean',
      allowNull: false
    }, path), `${path.join()} ${BoolErrors.DO_NOT_ALLOW_NULL}`);
  });

  it('provide string', () => {
    assert.strictEqual(handlerSwitch('true', { type: 'boolean' }, path), `${path.join()} ${BoolErrors.NOT_A_BOOL}`);
  });
});