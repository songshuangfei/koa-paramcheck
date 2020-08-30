type DateType = 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'any';

interface RuleBase {
  type: DateType,
  allowNull?: boolean
}

export interface StringRule extends RuleBase {
  type: 'string',
  regExp?: RegExp,
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

export interface ObjectRule extends RuleBase {
  type: 'object',
  itemRule: Rule,
  properties: {
    [key: string]: Rule,
  },
  requiredKeys?: string[],
  allowOtherKeys?: boolean,
}

export type Rule = StringRule | NumberRule | BoolRule | ArrayRule | ObjectRule | AnyRule;
