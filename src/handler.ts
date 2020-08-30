import {
  StringRule,
  NumberRule,
  BoolRule,
  AnyRule,
  ArrayRule,
  ObjectRule
} from './type/rules';

import {
  StringErrors
} from './type/errors';

import { removeSpace } from './utils/string'

const defaultStringRule: StringRule = {
  type: 'string',
  allowEmpty: true,
  allowSpace: true,
  allowNull: false,
}

export function stringHandler(value: any, rule: StringRule): StringErrors | null {
  rule = Object.assign({}, defaultStringRule, rule);
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
