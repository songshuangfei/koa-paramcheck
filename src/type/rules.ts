type DateType = 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'simpleArray'
  | 'object'
  | 'any';

interface RuleBase {
  type: DateType,
  allowNull?: boolean
}

export interface StringRule extends RuleBase {
  type: 'string',
  pattern?: RegExp,
  message?: string,
  allowSpace?: boolean,
  allowEmpty?: boolean
}

export interface NumberRule extends RuleBase {
  type: 'number',
  max?: number,
  min?: number,
  isInteger?: boolean
}

export interface BoolRule extends RuleBase {
  type: 'boolean'
}

export interface AnyRule extends RuleBase {
  type: 'any'
}

export interface ArrayRule extends RuleBase {
  type: 'array',
  itemRule: Rule,
  allowEmpty?: boolean
}

export interface SimpleArrayRule extends RuleBase {
  type: 'simpleArray',
  itemRule: StringRule | BoolRule | NumberRule,
  allowEmpty?: boolean
}

export interface ObjectRule extends RuleBase {
  type: 'object',
  properties: {
    [key: string]: Rule,
  },
  requiredKeys?: string[],
  allowOtherKeys?: boolean,
}

export type Rule = StringRule | NumberRule | BoolRule | ArrayRule | ObjectRule | AnyRule | SimpleArrayRule;

// query rules
export interface QueryRule {
  properties: {
    [key: string]: StringRule | BoolRule | NumberRule | SimpleArrayRule,
  },
  requiredKeys?: string[],
}
