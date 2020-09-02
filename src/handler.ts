import {
  StringRule,
  NumberRule,
  BoolRule,
  AnyRule,
  ArrayRule,
  ObjectRule
} from './type/rules';

import {
  StringErrors,
  NumberErrors,
  BoolErrors,
  AnyErrors,
} from './type/errors';

import { removeSpace } from './utils/string'

//default rule config
const defaultStrRule: StringRule = {
  type: 'string',
  allowEmpty: true,
  allowSpace: true,
  allowNull: false,
}

const defaultNumRule: NumberRule = {
  type: 'number',
  allowNull: false,
  max: Infinity,
  min: -Infinity,
  isInteger: false
}

const defaultBoolRule: BoolRule = {
  type: 'boolean',
  allowNull: false,
}

const defaultAnyRule: AnyRule = {
  type: 'any',
  allowNull: true
}

export function stringHandler(value: any, rule: StringRule): StringErrors | null {
  rule = Object.assign({}, defaultStrRule, rule);
  //pass null
  if (value === null)
    return rule.allowNull ? null : StringErrors.DO_NOT_ALLOW_NULL;
  //verify
  if (typeof value !== 'string')
    return StringErrors.NOT_A_STRING;
  if (rule.regExp && !rule.regExp.test(value))
    return StringErrors.DO_NOT_MATCH_REGEXP;
  if (!rule.allowSpace && removeSpace(value).length !== value.length)
    return StringErrors.DO_NOT_ALLOW_SPACE;
  if (!rule.allowEmpty && removeSpace(value) === '')
    return StringErrors.DO_NOT_ALLOW_EMPTY;
  return null;
}

export function numberHandler(value: any, rule: NumberRule): NumberErrors | null {
  const r = Object.assign({}, defaultNumRule, rule) as {
    allowNull: boolean,
    max: number,
    min: number,
    isInteger: boolean
  };

  if (value === null)
    return r.allowNull ? null : NumberErrors.DO_NOT_ALLOW_NULL;
  if (typeof value !== 'number')
    return NumberErrors.NOT_A_NUMBER;
  if (r.isInteger && !Number.isInteger(value))
    return NumberErrors.NOT_A_INTEGER;
  if (value < r.min || value > r.max)
    return NumberErrors.OUT_OF_RANGE;
  return null;
}

export function boolHandler(value: any, rule: BoolRule): BoolErrors | null {
  rule = Object.assign({}, defaultBoolRule, rule);
  if (value === null)
    return rule.allowNull ? null : BoolErrors.DO_NOT_ALLOW_NULL;
  if (typeof value !== 'boolean')
    return BoolErrors.NOT_A_BOOL;
  return null
}

export function anyHandler(value: any, rule: AnyRule): AnyErrors | null {
  rule = Object.assign({}, defaultAnyRule, rule);
  if (value === null)
    return rule.allowNull ? null : AnyErrors.DO_NOT_ALLOW_NULL;
  return null
}