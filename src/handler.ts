import {
  StringRule,
  NumberRule,
  BoolRule,
  AnyRule,
  ArrayRule,
  ObjectRule,
  Rule
} from './type/rules';

import {
  StringErrors,
  NumberErrors,
  BoolErrors,
  AnyErrors,
  ArrayErrors,
  ObjectErrors,
  getStringErrInfo,
  getNumberErrInfo,
  getBoolErrInfo,
  getAnyErrInfo,
  getArrayErrInfo,
  getObjectErrInfo
} from './type/errors';

import {
  removeStrSpace,
  isObject,
  AttrPath,
} from './utils';

export function stringHandler(value: any, rawRule: StringRule, attrPath: AttrPath): string | null {
  const rule = Object.assign({}, {
    allowEmpty: true,
    allowSpace: true,
    allowNull: false,
  }, rawRule);
  //pass null
  if (value === null)
    return rule.allowNull ? null : getStringErrInfo(attrPath.join(), StringErrors.DO_NOT_ALLOW_NULL);
  //verify
  if (typeof value !== 'string')
    return getStringErrInfo(attrPath.join(), StringErrors.NOT_A_STRING);
  if (rule.regExp && !rule.regExp.test(value)) {
    if (rule.message)
      return rule.message.replace('{{path}}', attrPath.join());
    else
      return getStringErrInfo(attrPath.join(), StringErrors.DO_NOT_MATCH_REGEXP, rule.regExp.toString());
  }
  if (!rule.allowSpace && removeStrSpace(value).length !== value.length)
    return getStringErrInfo(attrPath.join(), StringErrors.DO_NOT_ALLOW_SPACE);
  if (!rule.allowEmpty && removeStrSpace(value) === '')
    return getStringErrInfo(attrPath.join(), StringErrors.DO_NOT_ALLOW_EMPTY);
  return null;
}

export function numberHandler(value: any, rawRule: NumberRule, attrPath: AttrPath): string | null {
  const rule = Object.assign({}, {
    allowNull: false,
    max: Infinity,
    min: -Infinity,
    isInteger: false
  }, rawRule);
  if (value === null)
    return rule.allowNull ? null : getNumberErrInfo(attrPath.join(), NumberErrors.DO_NOT_ALLOW_NULL);
  if (typeof value !== 'number')
    return getNumberErrInfo(attrPath.join(), NumberErrors.NOT_AN_NUMBER);
  if (rule.isInteger && !Number.isInteger(value))
    return getNumberErrInfo(attrPath.join(), NumberErrors.NOT_AN_INTEGER);
  if (value < rule.min || value > rule.max)
    return getNumberErrInfo(attrPath.join(), NumberErrors.OUT_OF_RANGE, { min: rule.min, max: rule.max });
  return null;
}

export function boolHandler(value: any, rawRule: BoolRule, attrPath: AttrPath): string | null {
  const rule = Object.assign({}, { allowNull: false }, rawRule);
  if (value === null)
    return rule.allowNull ? null : getBoolErrInfo(attrPath.join(), BoolErrors.DO_NOT_ALLOW_NULL);
  if (typeof value !== 'boolean')
    return getBoolErrInfo(attrPath.join(), BoolErrors.NOT_A_BOOL);
  return null;
}

export function anyHandler(value: any, rawRule: AnyRule, attrPath: AttrPath): string | null {
  const rule = Object.assign({}, { allowNull: true }, rawRule);
  if (value === null)
    return rule.allowNull ? null : getAnyErrInfo(attrPath.join(), AnyErrors.DO_NOT_ALLOW_NULL);
  return null;
}

function arrayHandler(value: any, rawRule: ArrayRule, attrPath: AttrPath): string | null {
  const rule = Object.assign({}, { allowNull: false, allowEmpty: true }, rawRule);
  if (value === null)
    return rule.allowNull ? null : getArrayErrInfo(attrPath.join(), ArrayErrors.DO_NOT_ALLOW_NULL);
  if (!(value instanceof Array))
    return getArrayErrInfo(attrPath.join(), ArrayErrors.NOT_AN_ARRAY);
  if (!rule.allowEmpty && value.length === 0)
    return getArrayErrInfo(attrPath.join(), ArrayErrors.DO_NOT_ALLOW_EMPTY);
  const errors: string[] = []
  for (const [index, item] of value.entries()) {
    const err = handlerSwitch(item, rule.itemRule, attrPath.clone().push(index));
    err && errors.push(err);
  }
  return errors.length ? errors.join('; ') : null;
}

export function objectHandler(value: any, rawRule: ObjectRule, attrPath: AttrPath): string | null {
  const rule = Object.assign({}, {
    allowNull: false,
    allowOtherKeys: true
  }, rawRule);
  if (value === null)
    return rule.allowNull ? null : getObjectErrInfo(attrPath.join(), ObjectErrors.DO_NOT_ALLOW_NULL);

  const valueKeys = new Set(Object.keys(value));
  const rulePropertiesKeys = new Set(Object.keys(rule.properties));
  const requiredKeys = new Set(rule.requiredKeys || []);
  if (rulePropertiesKeys.size === 0)
    throw new Error('\"properties\" can not be empty in object rule.');
  if (!isObject(value))
    return getObjectErrInfo(attrPath.join(), ObjectErrors.NOT_AN_OBJECT);
  const errors: string[] = [];
  for (const [propertyKey, propertyRule] of Object.entries(rule.properties)) {
    if (valueKeys.has(propertyKey)) {
      //delete the key found in value from the Set
      valueKeys.delete(propertyKey);
      const err = handlerSwitch(value[propertyKey], propertyRule, attrPath.clone().push(propertyKey));
      err && errors.push(err);
    } else {
      const path = attrPath.clone().push(propertyKey).join();
      requiredKeys.has(propertyKey) && errors.push(getObjectErrInfo(path, ObjectErrors.KEY_REQUIRED));
    }
  }

  if (!rule.allowOtherKeys) {
    for (const key of valueKeys) {
      const path = attrPath.clone().push(key).join();
      errors.push(getObjectErrInfo(path, ObjectErrors.KEY_NOT_ALLOWED));
    }
  }
  return errors.length ? errors.join('; ') : null;
}

export function handlerSwitch(value: any, rule: Rule, attrPath: AttrPath): string | null {
  let err: string | null = null;
  switch (rule.type) {
    case 'string':
      err = stringHandler(value, rule, attrPath);
      break;
    case 'number':
      err = numberHandler(value, rule, attrPath);
      break;
    case 'boolean':
      err = boolHandler(value, rule, attrPath)
      break;
    case 'any':
      err = anyHandler(value, rule, attrPath)
      break;
    case 'array':
      err = arrayHandler(value, rule, attrPath);
      break;
    case 'object':
      err = objectHandler(value, rule, attrPath);
      break
  }
  return err || null;
}