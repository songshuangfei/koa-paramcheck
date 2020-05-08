/**
 * koa-paramcheck
 */
import * as Koa from "koa";
import * as Parse from "co-body";

declare module "koa" {
  interface Request {
    // if http parameter pass the check, it will be parse and set to here
    passedParams:{
      query?: any,
      body?: any
    }
  }
}

/**
 * rules used to check
 */
interface StringRule { type: "string", regExp?: RegExp, message?: string }
interface NumberRule { type: "number", max?: number, min?: number }
interface BoolRule { type: "boolean" }
interface AnyRule { type: "any" }
interface ArrayRule { type: "array", itemRule: Rule }
interface ObjectRule { type: "object", attrRules: Array<AttrRule> }

type QueryStringRule = StringRule;
interface QueryArrayRule {
  type: "array",
  itemRule: {
    regExp?: RegExp,
    message?: string
  }
}

export type Rule = StringRule | NumberRule | BoolRule | ArrayRule | ObjectRule | AnyRule;
export type QueryRule = QueryStringRule | QueryArrayRule;
type AttrRule = StringRule & { key: string } | NumberRule & { key: string } | BoolRule & { key: string } | ArrayRule & { key: string } | ObjectRule & { key: string } | AnyRule & { key: string };
type AttrQueryRule = QueryStringRule & { key: string } | QueryArrayRule & { key: string };

type AttrPath = Array<string | number>;

/**
 * join attributes to a string
 * ["a",1,"b",0] -> "a[1].b[0]"
 */
function joinAttrPath(arr: AttrPath): string {
  let res = "";
  arr.forEach((v) => {
    if (typeof v === "number") res += `[${v}]`
    else res += res ? `.${v}` : `${v}`
  })
  return res;
}


function getRange(min: number | undefined, max: number | undefined): string {
  let left = "", right = "";
  left = min === undefined ? "(-∞" : `[${min}`;
  right = max === undefined ? "+∞)" : `${max}]`;
  return `${left}, ${right}; `;
}

/**
 * Judge if the body  is a application/json
 */
async function isJSONBody(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>):Promise< [boolean, any]> {
  if (ctx.request.headers['content-type'] !== 'application/json')
    return [false, null];
  try {
    const res = await Parse.json(ctx.req);
    return [true, res]
  } catch (error) {
    console.error(error)
    return [false, null]
  }
}

/**
 * objectHandler() string check
 * @param attrPath used to record the attribute path
 * @param value current value to check
 * @param rule current rule, used to check value
 */
function stringHandler(attrPath: AttrPath, value: any, rule: StringRule): string | null {
  const path = joinAttrPath(attrPath);
  if (typeof value !== "string")
    return `${path} must be a string; `;
  if (rule.regExp && !rule.regExp.test(value)) {
    if (rule.message)
      return `${rule.message.replace("{{path}}", path)}; `
    else
      return `${path} dose not match ${rule.regExp.toString()}; `
  }
  return null
}

function numberHandler(attrPath: AttrPath, value: any, rule: NumberRule): string | null {
  const path = joinAttrPath(attrPath);
  if (typeof value !== "number")
    return `${path} must be a number; `;
  const { min, max } = rule;
  if ((min !== undefined && value < min) || (max !== undefined && value > max))
    return `${path} must be in range${getRange(min, max)}`
  return null
}

function booleanHandler(attrPath: AttrPath, value: any, rule: BoolRule): string | null {
  if (typeof value !== "boolean")
    return `${joinAttrPath(attrPath)} must be a boolean; `;
  return null
}

function anyHandler(attrPath: AttrPath, value: any, rule: AnyRule): string | null {
  if (value === undefined) {
    return `${joinAttrPath(attrPath)} is required; `
  }
  return null
}
/**
 * arrayHandler() check the ayyary data according to ArrayRule
 * @param attrPath 
 * @param value 
 * @param rule 
 */
function arrayHandler(attrPath: AttrPath, value: any, rule: ArrayRule): string | null {
  if (!(value instanceof Array))
    return `${joinAttrPath(attrPath)} must be an Array; `;
  const errs: string[] = [];
  for (const arrayItem of value.entries()) {
    const nextAttrPath = [...attrPath, arrayItem[0]];
    const attrValue = value[arrayItem[0]];
    let err: string | null = null;
    switch (rule.itemRule.type) {
      case "string":
        err = stringHandler(nextAttrPath, attrValue, rule.itemRule);
        break;
      case "number":
        err = numberHandler(nextAttrPath, attrValue, rule.itemRule);
        break;
      case "boolean":
        err = booleanHandler(nextAttrPath, attrValue, rule.itemRule);
        break;
      case "any":
        err = anyHandler(nextAttrPath, attrValue, rule.itemRule);
        break;
      case "array":
        err = arrayHandler(nextAttrPath, attrValue, rule.itemRule);
        break;
      case "object":
        err = objectHandler(nextAttrPath, attrValue, rule.itemRule);
        break;
    }
    if (err) errs.push(err);
  }
  if (errs.length === 0) return null;
  return errs.join("");
}


/**
 * objectHandler() check the received JSON string or object in JSON
 * @param attrPath record the attribute path
 * @param value current value to check
 * @param rule current rule, used to check velue
 */
function objectHandler(attrPath: AttrPath, value: any, rule: ObjectRule): string | null {
  if (value instanceof Array || typeof value !== 'object')
    return `${joinAttrPath(attrPath)} must be an object; `;
  const errs: string[] = [];
  const bodyKeys = Reflect.ownKeys(value);
  for (const attrRule of rule.attrRules) {
    const nextAttrPath = [...attrPath, attrRule.key];
    if (!bodyKeys.includes(attrRule.key)) {
      errs.push(`${joinAttrPath(nextAttrPath)} is required; `);
      continue;
    }
    const attrValue = value[attrRule.key];
    let err: null | string = null;
    switch (attrRule.type) {
      case "string":
        err = stringHandler(nextAttrPath, attrValue, attrRule);
        break;
      case "number":
        err = numberHandler(nextAttrPath, attrValue, attrRule);
        break;
      case "boolean":
        err = booleanHandler(nextAttrPath, attrValue, attrRule);
        break;
      case "any":
        err = anyHandler(nextAttrPath, attrValue, attrRule);
        break;
      case "array":
        err = arrayHandler(nextAttrPath, attrValue, attrRule);
        break;
      case "object":
        err = objectHandler(nextAttrPath, attrValue, attrRule);
        break;
    }
    if (err) errs.push(err)
  }

  if (errs.length === 0) return null;
  return errs.join("");
}

/**
 * queryHandler(), check the query object according to rules
 * @param query query object from ctx.query
 * @param rules query object rule
 */
function queryHandler(query: any, rules: Array<AttrQueryRule>): string | null {
  const queryKeys = Reflect.ownKeys(query);
  const errs: string[] = [];
  for (const rule of rules) {
    if (!queryKeys.includes(rule.key)) {
      errs.push(`${rule.key} is required; `);
      continue;
    }
    const value = query[rule.key];
    let err: string | null = null;
    switch (rule.type) {
      case "string":
        err = stringHandler([rule.key], value, rule)
        break;
      case "array":
        /**
         *rray item be checked as string
         */
        err = arrayHandler([rule.key], value, {
          type: "array", itemRule: { type: "string", ...rule.itemRule }
        })
        break;
    }
    if (err) errs.push(err);
  }
  if (errs.length === 0) return null;
  return errs.join("");
}

/**
 * jsonBodyCheck() precheck  for application/json body;
 */
export function jsonBodyCheck(rules: Array<AttrRule>) {
  return async (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) => {
    const [succeed, parsedJSON] = await isJSONBody(ctx);
    if (!succeed) {
      ctx.status = 400;
      ctx.body = { bodyError: "body must be a JSON" };
      return
    }
    const bodyErrMsg = objectHandler([], parsedJSON, {
      type: "object",
      attrRules: rules,
    })
    if (bodyErrMsg) {
      ctx.status = 400;
      ctx.body = { bodyError: bodyErrMsg };
    } else {
      ctx.request.passedParams = { body: parsedJSON }
      await next()
    }
  }
}

/**
 * queryCheck(), precheck for query
 */
export function queryCheck(rules: Array<AttrQueryRule>) {
  return async (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) => {
    const queryErrMsg = queryHandler(ctx.query, rules);
    if (queryErrMsg) {
      ctx.status = 400;
      ctx.body = { queryError: queryErrMsg };
    } else {
      ctx.request.passedParams = { query: ctx.query };
      await next()
    }
  }
}
