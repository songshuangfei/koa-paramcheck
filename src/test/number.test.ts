import assert from 'assert';
import { handlerSwitch } from '../handler';
import { NumberErrors } from '../type/errors';

import { AttrPath } from '../utils'

describe('number handler', () => {
  const path = new AttrPath();
  
  it('allow null, provide null',()=>{
    assert.equal(handlerSwitch(null, {
      type: 'number',
      allowNull: true
    },path), null);
  });

  it('do not allow null, provide null',()=>{
    assert.equal(handlerSwitch(null, {
      type: 'number',
      allowNull: false
    },path), `${path.join()} ${NumberErrors.DO_NOT_ALLOW_NULL}`);
  });

  it('double, provide double, out of range',()=>{
    assert.equal(handlerSwitch(1.2, {
      type: 'number',
      min: 0,
      max: 1,
    },path), `${path.join()} ${NumberErrors.OUT_OF_RANGE} [0, 1]`);
  });

  it('double, provide double, in range',()=>{
    assert.equal(handlerSwitch(0.2, {
      type: 'number',
      min: 0,
      max: 1,
    },path), null);
  });

  it('interger, provide interger, out of range',()=>{
    assert.equal(handlerSwitch(11, {
      type: 'number',
      isInteger: true,
      min: 0,
      max: 10,
    },path), `${path.join()} ${NumberErrors.OUT_OF_RANGE} [0, 10]`);
  });

  it('interger, provide interger, in range',()=>{
    assert.equal(handlerSwitch(5, {
      type: 'number',
      isInteger: true,
      min: 0,
      max: 10,
    },path), null);
  });

  it('interger, provide double',()=>{
    assert.equal(handlerSwitch(0.2, {
      type: 'number',
      isInteger: true,
    },path),  `${path.join()} ${NumberErrors.NOT_AN_INTEGER}`);
  });

})