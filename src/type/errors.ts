export enum StringErrors {
  DO_NOT_ALLOW_NULL = 'can not be null',
  NOT_A_STRING = 'must be a string',
  DO_NOT_ALLOW_EMPTY = 'can not be an empty string',
  DO_NOT_ALLOW_SPACE = 'can not contain spaces',
  DO_NOT_MATCH_REGEXP = 'does not match regexp',
}

export enum NumberErrors {
  DO_NOT_ALLOW_NULL = 'can not be null',
  NOT_AN_NUMBER = 'must be an number',
  NOT_AN_INTEGER = 'must be an integer',
  OUT_OF_RANGE = 'does not in range',
}

export enum BoolErrors {
  DO_NOT_ALLOW_NULL = 'can not be null',
  NOT_A_BOOL = 'must be a boolean',
}

export enum AnyErrors {
  DO_NOT_ALLOW_NULL = 'can not be null',
}

export enum ArrayErrors {
  DO_NOT_ALLOW_NULL = 'can not be null',
  NOT_AN_ARRAY = 'must be an array',
  DO_NOT_ALLOW_EMPTY = 'can not be an empty array'
}

export enum ObjectErrors {
  DO_NOT_ALLOW_NULL = 'can not be null',
  NOT_AN_OBJECT = 'must be an object',
  KEY_REQUIRED = 'is required',
  KEY_NOT_ALLOWED = 'is not allowed',
}

