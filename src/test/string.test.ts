import assert from 'assert';
import { handlerSwitch } from '../handler';
import { StringErrors } from '../type/errors';

import { AttrPath } from '../utils'


describe('string handler', () => {
  const path = new AttrPath();

  it('allow null, provide null', () => {
    assert.equal(handlerSwitch(null, {
      type: 'string',
      allowNull: true
    }, path), null);
  });

  it('do not allow null, provide null', () => {
    assert.equal(handlerSwitch(null, {
      type: 'string',
      allowNull: false
    }, path), `${path.join()} ${StringErrors.DO_NOT_ALLOW_NULL}`);
  });

  it('provide not-string', () => {
    assert.equal(handlerSwitch(1, {
      type: 'string',
      allowNull: true
    }, path), `${path.join()} ${StringErrors.NOT_A_STRING}`);
  });

  it('regexp with message', () => {
    assert.equal(handlerSwitch('abc', {
      type: 'string',
      allowNull: false,
      regExp: /[0-9]+/,
      message: '{{path}} must be number'
    }, path), `${path.join()} must be number`);
  });

  it('regexp without message', () => {
    assert.equal(handlerSwitch('abc', {
      type: 'string',
      allowNull: false,
      regExp: /[0-9]+/,
    }, path), `${path.join()} ${StringErrors.DO_NOT_MATCH_REGEXP} ${/[0-9]+/.toString()}`);
  });

  it('do not allow empty, provide empty', () => {
    assert.equal(handlerSwitch('', {
      type: 'string',
      allowEmpty: false,
    }, path), `${path.join()} ${StringErrors.DO_NOT_ALLOW_EMPTY}`);
  });

  it('allow empty, provide empty', () => {
    assert.equal(handlerSwitch('   ', {
      type: 'string',
      allowEmpty: true,
    }, path), null);
  });

  it('allow space, provide space', () => {
    assert.equal(handlerSwitch('   ', {
      type: 'string',
      allowSpace: true,
    }, path), null);
  });

  it('do not allow space, provide space', () => {
    assert.equal(handlerSwitch('   ', {
      type: 'string',
      allowSpace: false,
    }, path), `${path.join()} ${StringErrors.DO_NOT_ALLOW_SPACE}`);
  });
})