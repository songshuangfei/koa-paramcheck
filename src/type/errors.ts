export enum StringErrors {
  DO_NOT_ALLOW_NULL = 'can not be null',
  NOT_A_STRING = 'must be a string',
  DO_NOT_ALLOW_EMPTY = 'can not be an empty string',
  DO_NOT_ALLOW_SPACE = 'can not contain spaces',
  DO_NOT_MATCH_REGEXP = 'does not match regexp',
}

type SimpleStringErrInfo = StringErrors.DO_NOT_ALLOW_NULL
  | StringErrors.NOT_A_STRING
  | StringErrors.DO_NOT_ALLOW_EMPTY
  | StringErrors.DO_NOT_ALLOW_SPACE

export function getStringErrInfo(attrPath: string, err: SimpleStringErrInfo): string;
export function getStringErrInfo(attrPath: string, err: StringErrors.DO_NOT_MATCH_REGEXP, regExpString: string): string;
export function getStringErrInfo(attrPath: string, err: StringErrors, regExpString?: string): string {
  if (err === StringErrors.DO_NOT_MATCH_REGEXP)
    return `${attrPath} ${err} ${regExpString}`;
  return `${attrPath} ${err}`;
}

export enum NumberErrors {
  DO_NOT_ALLOW_NULL = 'can not be null',
  NOT_AN_NUMBER = 'must be an number',
  NOT_AN_INTEGER = 'must be an integer',
  OUT_OF_RANGE = 'does not in range',
}

type SimpleNumErrInfo = NumberErrors.DO_NOT_ALLOW_NULL
  | NumberErrors.NOT_AN_NUMBER
  | NumberErrors.NOT_AN_INTEGER

export function getNumberErrInfo(attrPath: string, err: SimpleNumErrInfo): string;
export function getNumberErrInfo(attrPath: string, err: NumberErrors.OUT_OF_RANGE, range: { max: number, min: number }): string;
export function getNumberErrInfo(attrPath: string, err: NumberErrors, range?: { max: number, min: number }): string {
  if (err === NumberErrors.OUT_OF_RANGE)
    return `${attrPath} ${err} [${range?.min}, ${range?.max}]`;
  return `${attrPath} ${err}`;
}

export enum BoolErrors {
  DO_NOT_ALLOW_NULL = 'can not be null',
  NOT_A_BOOL = 'must be a boolean',
}

export const getBoolErrInfo = (attrPath: string, err: BoolErrors) => `${attrPath} ${err}`;

export enum AnyErrors {
  DO_NOT_ALLOW_NULL = 'can not be null',
}

export const getAnyErrInfo = (attrPath: string, err: AnyErrors) => `${attrPath} ${err}`;

export enum ArrayErrors {
  DO_NOT_ALLOW_NULL = 'can not be null',
  NOT_AN_ARRAY = 'must be an array',
  DO_NOT_ALLOW_EMPTY = 'can not be an empty array'
}

export const getArrayErrInfo = (attrPath: string, err: ArrayErrors) => `${attrPath} ${err}`;

export enum ObjectErrors {
  DO_NOT_ALLOW_NULL = 'can not be null',
  NOT_AN_OBJECT = 'must be an object',
  KEY_REQUIRED = 'is required',
  KEY_NOT_ALLOWED = 'is not allowed',
}
export const getObjectErrInfo = (attrPath: string, err: ObjectErrors) => `${attrPath} ${err}`;


