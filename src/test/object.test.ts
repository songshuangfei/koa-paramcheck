import assert from 'assert';
import { handlerSwitch } from '../handler';
import { ObjectErrors, NumberErrors } from '../type/errors';
import { AttrPath } from '../utils'

describe('object handler', () => {
  const path = new AttrPath();
  it('allow null, provide null', () => {
    assert.strictEqual(handlerSwitch(null, {
      type: 'object',
      properties: { x: { type: 'number' } },
      allowNull: true
    }, path), null);
  });

  it('do not allow null, provide null', () => {
    assert.strictEqual(handlerSwitch(null, {
      type: 'object',
      properties:{},
      allowNull: false
    }, path), `${path.join()} ${ObjectErrors.DO_NOT_ALLOW_NULL}`);
  });

  it('provide not-object', () => {
    assert.strictEqual(handlerSwitch(1, {
      type: 'object',
      properties: { x: { type: 'number' } },
      allowNull: false
    }, path), `${path.join()} ${ObjectErrors.NOT_AN_OBJECT}`);
  });

  it('required key', () => {
    assert.strictEqual(handlerSwitch({y:{}}, {
      type: 'object',
      properties: { 
        x: { type: 'number' },
        y:{
          type:'object',
          properties:{
            z:{type:'number'},
          },
          requiredKeys:['z']
        }
      },
      allowNull: false,
      requiredKeys:['x']
    }, path), `x ${ObjectErrors.KEY_REQUIRED}; `+
      `y.z ${ObjectErrors.KEY_REQUIRED}`
    );
  });

  it('provide wrong property', () => {
    assert.strictEqual(handlerSwitch({ y: { z: 11 } }, {
      type: 'object',
      properties: {
        y: {
          type: 'object',
          properties: {
            z: {
              type: 'number',
              max: 10,
              min: 0
            },
          },
          requiredKeys: ['z']
        }
      },
      allowNull: false,
    }, path), `y.z ${NumberErrors.OUT_OF_RANGE} [0, 10]`);
  });

  it('do not allow other keys', () => {
    assert.strictEqual(handlerSwitch({ a: '1', b: '2' }, {
      type: 'object',
      properties: {
        x: { type: 'string'},
        y: { type: 'string'},
        z: { type: 'string'},
      },
      allowNull: false,
      allowOtherKeys: false
    }, path), `a ${ObjectErrors.KEY_NOT_ALLOWED}; b ${ObjectErrors.KEY_NOT_ALLOWED}`);
  });

  it('array in object', () => {
    assert.strictEqual(handlerSwitch({ a: [2, '2', 1, '3'] }, {
      type: 'object',
      properties: {
        a: {
          type: 'array',
          itemRule: {type:'number'}
        }
      },
      allowNull: false,
      allowOtherKeys: false
    }, path), `a[1] ${NumberErrors.NOT_AN_NUMBER}; a[3] ${NumberErrors.NOT_AN_NUMBER}`);
  });

});