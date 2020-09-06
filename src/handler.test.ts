// import assert from "assert";
// import {
//   stringHandler,
//   numberHandler,
//   boolHandler,
//   anyHandler,
//   objectHandler,
//   handlerSwitch
// } from './handler';
// import {
//   StringErrors,
//   NumberErrors,
//   BoolErrors,
//   AnyErrors,
//   ObjectErrors,
// } from './type/errors';

// import {
//   AttrPath
// } from "./utils"


// describe('data type handler', () => {
//   it('string',()=>{
//     const path = new AttrPath();
//     assert.equal(handlerSwitch(null, {
//       type: 'string',
//       allowNull: false
//     },path), `${path.join()} ${StringErrors.DO_NOT_ALLOW_NULL}`);

//     assert.equal(handlerSwitch("abc", {
//       type: 'string',
//       allowNull: false,
//       regExp:/[0-9]+/,
//     },path), `${path.join()} ${StringErrors.DO_NOT_MATCH_REGEXP} ${/[0-9]+/.toString()}`);

//     assert.equal(handlerSwitch("abc", {
//       type: 'string',
//       allowNull: false,
//       regExp:/[0-9]+/,
//       message:"{{path}} must be number"
//     },path), `${path.join()} must be number`);
//   })
//   // it('string handler', () => {
//   //   assert.equal(stringHandler(null, {
//   //     type: 'string',
//   //     allowNull: false
//   //   }), StringErrors.DO_NOT_ALLOW_NULL);

//   //   assert.equal(stringHandler(null, {
//   //     type: 'string',
//   //     allowNull: true
//   //   }), null);

//   //   assert.equal(stringHandler('', {
//   //     type: 'string',
//   //     allowEmpty: false
//   //   }), StringErrors.DO_NOT_ALLOW_EMPTY);

//   //   assert.equal(stringHandler('', {
//   //     type: 'string',
//   //     allowEmpty: true
//   //   }), null);

//   //   assert.equal(stringHandler(' ', {
//   //     type: 'string',
//   //     allowSpace: true,
//   //   }), null);

//   //   assert.equal(stringHandler(' a', {
//   //     type: 'string',
//   //     allowSpace: false
//   //   }), StringErrors.DO_NOT_ALLOW_SPACE);

//   //   assert.equal(stringHandler('a', {
//   //     type: 'string',
//   //     regExp: /^[0-9]*$/,
//   //   }), StringErrors.DO_NOT_MATCH_REGEXP);

//   //   assert.equal(stringHandler('1554', {
//   //     type: 'string',
//   //     regExp: /^[0-9]*$/,
//   //   }), null);

//   //   assert.equal(stringHandler(' ', {
//   //     type: 'string',
//   //     allowSpace: true,
//   //     allowEmpty: false
//   //   }), StringErrors.DO_NOT_ALLOW_EMPTY);
//   // });

//   // it('number handler', () => {
//   //   assert.equal(numberHandler('1', {
//   //     type: 'number',
//   //   }), NumberErrors.NOT_AN_NUMBER);

//   //   assert.equal(numberHandler(1.2, {
//   //     type: 'number',
//   //     isInteger: true
//   //   }), NumberErrors.NOT_AN_INTEGER);

//   //   assert.equal(numberHandler(1, {
//   //     type: 'number',
//   //     isInteger: true
//   //   }), null);

//   //   assert.equal(numberHandler(-1, {
//   //     type: 'number',
//   //     isInteger: true,
//   //     max: 10,
//   //     min: 0
//   //   }), NumberErrors.OUT_OF_RANGE);
//   // });

//   // it('boolean handler', () => {
//   //   assert.equal(
//   //     boolHandler(0, { type: 'boolean', allowNull: false }),
//   //     BoolErrors.NOT_A_BOOL
//   //   );
//   //   assert.equal(
//   //     boolHandler(null, { type: 'boolean', allowNull: false }),
//   //     BoolErrors.DO_NOT_ALLOW_NULL
//   //   );

//   //   assert.equal(
//   //     boolHandler(null, { type: 'boolean', allowNull: true }),
//   //     null
//   //   );
//   // });

//   // it('any handler', () => {
//   //   assert.equal(
//   //     anyHandler(null, { type: 'any', allowNull:false }),
//   //     AnyErrors.DO_NOT_ALLOW_NULL
//   //   )
//   // });

// })