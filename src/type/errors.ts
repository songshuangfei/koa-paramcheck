export enum StringErrors {
  DO_NOT_ALLOW_NULL = 1,
  NOT_A_STRING,
  DO_NOT_ALLOW_EMPTY,
  DO_NOT_ALLOW_SPACE,
  DO_NOT_MATCH_REGEXP,
}

export enum NumberErrors {
  DO_NOT_ALLOW_NULL = 1,
  NOT_A_NUMBER,
  NOT_A_INTEGER,
  OUT_OF_RANGE,
}

export enum BoolErrors {
  DO_NOT_ALLOW_NULL = 1,
  NOT_A_BOOL,
}

export enum AnyErrors {
  DO_NOT_ALLOW_NULL = 1,
}