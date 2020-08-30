import assert from "assert";
import { stringHandler } from './handler';
import {
  StringErrors
} from './type/errors';

describe('data type handler', () => {

  it('string handler', () => {
  
    assert.equal(stringHandler(null, { 
      type: 'string', 
      allowNull: false 
    }), StringErrors.DO_NOT_ALLOW_NULL);

    assert.equal(stringHandler(null, { 
      type: 'string', 
      allowNull: true 
    }), null);

    assert.equal(stringHandler('', { 
      type: 'string', 
      allowEmpty: false 
    }), StringErrors.DO_NOT_ALLOW_EMPTY);

    assert.equal(stringHandler('', { 
      type: 'string', 
      allowEmpty: true 
    }), null);

    assert.equal(stringHandler(' ', { 
      type: 'string', 
      allowSpace: true,
    }), null);

    assert.equal(stringHandler(' a', { 
      type: 'string', 
      allowSpace: false
    }), StringErrors.DO_NOT_ALLOW_SPACE);

    assert.equal(stringHandler('a', { 
      type: 'string', 
      regExp: /^[0-9]*$/,
    }), StringErrors.DO_NOT_MATCH_REGEXP);

    assert.equal(stringHandler('1554', { 
      type: 'string', 
      regExp: /^[0-9]*$/,
    }), null);

    assert.equal(stringHandler(' ', { 
      type: 'string', 
      allowSpace: true,
      allowEmpty: false
    }), StringErrors.DO_NOT_ALLOW_EMPTY);

  });

})