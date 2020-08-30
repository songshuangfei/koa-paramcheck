/**
 * koa-paramcheck
 */
import * as Koa from 'koa';
import { getRange, joinAttrPath, isJSONBody, transformQueryAttrtoArray } from './util';
declare module 'koa' {
  interface Request {
    // if http parameter pass the check, it will be parse and set to here
    passedParams:{
      query?: any,
      body?: any
    }
  }
}

type KoaMiddleware = (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) =>any
/**
 * rules used to check
 */
interface StringRule {
  type: 'string',
  regExp?: RegExp,
  message?: string
}

interface NumberRule {
  type: 'number',
  max?: number,
  min?: number
}
interface BoolRule {
  type: 'boolean'
}
interface AnyRule {
  type: 'any'
}
interface ArrayRule {
  type: 'array',
  itemRule: Rule,
  allowEmpty?: boolean
}
interface ObjectRule {
  type: 'object',
  attrRules: Array<AttrRule>,
  allowOtherKeys?: boolean
}
// rule
export type Rule = StringRule | NumberRule | BoolRule | ArrayRule | ObjectRule | AnyRule;
//rule for attributes in object
type AttrRule = Rule & { key: string };
//record attributs path
type AttrPath = Array<string | number>;

/**
 * stringHandler() string check
 * @param attrPath used to record the attribute path
 * @param value current value to check
 * @param rule current rule, used to check value
 */
function stringHandler(attrPath: AttrPath, value: any, rule: StringRule): string | null {
  const path = joinAttrPath(attrPath);
  if (typeof value !== 'string')
    return `${path} must be a string; `;
  if (rule.regExp && !rule.regExp.test(value)) {
    if (rule.message)
      return `${rule.message.replace('{{path}}', path)}; `;
    else
      return `${path} dose not match ${rule.regExp.toString()}; `;
  }
  return null;
}

function numberHandler(attrPath: AttrPath, value: any, rule: NumberRule): string | null {
  const path = joinAttrPath(attrPath);
  if (typeof value !== 'number')
    return `${path} must be a number; `;
  const { min, max } = rule;
  if ((min !== undefined && value < min) || (max !== undefined && value > max))
    return `${path} must be in range${getRange(min, max)}; `;
  return null;
}

function booleanHandler(attrPath: AttrPath, value: any, rule: BoolRule): string | null {
  if (typeof value !== 'boolean')
    return `${joinAttrPath(attrPath)} must be a boolean; `;
  return null;
}

function anyHandler(attrPath: AttrPath, value: any, rule: AnyRule): string | null {
  if (value === undefined) {
    return `${joinAttrPath(attrPath)} is required; `;
  }
  return null;
}

/**
 * arrayHandler() check the array data according to ArrayRule
 * @param attrPath 
 * @param value 
 * @param rule 
 */
function arrayHandler(attrPath: AttrPath, value: any, rule: ArrayRule): string | null {
  //Is value an array
  if (!(value instanceof Array))
    return `${joinAttrPath(attrPath)} must be an Array; `;
  //Is this array empty
  if(!rule.allowEmpty && value.length === 0 )
    return `${joinAttrPath(attrPath)} can not ba an empty array; `;
  const errs: string[] = [];
  // find error of each array item
  for (const [index, itemValue] of value.entries()) {
    const nextAttrPath = [...attrPath, index];
    const err = HandlerSwitch(nextAttrPath, itemValue, rule.itemRule);
    if (err) errs.push(err);
  }
  return errs.length === 0 ? null : errs.join('');
}

/**
 * objectHandler() check the received JSON string or object in JSON
 * @param attrPath record the attribute path
 * @param value current value to check
 * @param rule current rule, used to check velue
 */
function objectHandler(attrPath: AttrPath, value: any, rule: ObjectRule): string | null {
  //Is value an object
  if (value instanceof Array || typeof value !== 'object')
    return `${joinAttrPath(attrPath)} must be an object; `;
  //The errors of the attributes in the object
  const errs: string[] = [];
  const objKeys = Reflect.ownKeys(value);
  for (const attrRule of rule.attrRules) {
    //attribute path of the object
    const nextAttrPath = [...attrPath, attrRule.key];
    // Is the defined key missed in the object
    if (!objKeys.includes(attrRule.key)) {
      errs.push(`${joinAttrPath(nextAttrPath)} is required; `);
      continue;
    }
    //current attribute value
    const attrValue = value[attrRule.key];
    //error of current attribute
    const err = HandlerSwitch(nextAttrPath, attrValue, attrRule);
    if (err) errs.push(err);
  }
  //find the keys witch are not defined in the object attributes rules
  if (!rule.allowOtherKeys) {
    const allowedKeys = rule.attrRules.map(i => i.key);
    objKeys.forEach(key => {
      const pathStr = joinAttrPath([...attrPath, String(key)]);
      if (!allowedKeys.includes(String(key)))
        errs.push(`${pathStr} is not allowed; `);
    });
  }
  return errs.length === 0 ? null : errs.join('');
}

function HandlerSwitch(attrPath: AttrPath, value: any, rule: Rule): string | null {
  let err: string | null = null;
  switch (rule.type) {
  case 'string':
    err = stringHandler(attrPath, value, rule);
    break;
  case 'number':
    err = numberHandler(attrPath, value, rule);
    break;
  case 'boolean':
    err = booleanHandler(attrPath, value, rule);
    break;
  case 'any':
    err = anyHandler(attrPath, value, rule);
    break;
  case 'array':
    err = arrayHandler(attrPath, value, rule);
    break;
  case 'object':
    err = objectHandler(attrPath, value, rule);
    break;
  }
  if (err) return err;
  return null;
}


//JSON can be array or object
type JSONType = ArrayRule | ObjectRule;
/**
 * jsonBodyCheck() precheck  for application/json body;
 * json can be array or object
 */
export function jsonBodyCheck(rootRule: JSONType): KoaMiddleware {
  return async (ctx, next) => {
    const [succeed, parsedJSON] = await isJSONBody(ctx);
    if (!succeed) {
      ctx.status = 400;
      ctx.body = { bodyError: 'invalid JSON, only supports object and array; ' };
      return;
    }

    const bodyErrMsg = HandlerSwitch([], parsedJSON, rootRule);
    if (bodyErrMsg) {
      ctx.status = 400;
      ctx.body = { bodyError: bodyErrMsg };
    } else {
      ctx.request.passedParams = { body: parsedJSON };
      await next();
    }
  };
}

//--------------------query-----------------
// rule for query
export type QueryRule = StringRule | { type: 'array', itemRule: Omit<StringRule, 'type'>, allowEmpty?: boolean };
type AttrQueryRule = QueryRule & { key: string };
/**
 * queryCheck(), precheck for query
 */
export function queryCheck(rules: Array<AttrQueryRule>): KoaMiddleware {
  return async (ctx, next) => {
    const qobj = transformQueryAttrtoArray(ctx.query, rules.filter(i => i.type === 'array').map(i => i.key));
    const queryObjectRule: ObjectRule = {
      type: 'object',
      attrRules: rules.map(r=>{
        if(r.type==='string') return r;
        else return { ...r, itemRule: { ...r.itemRule, type: 'string' } };
      })
    };
    const queryErrMsg = HandlerSwitch([], qobj, queryObjectRule);
    if (queryErrMsg) {
      ctx.status = 400;
      ctx.body = { queryError: queryErrMsg };
    } else {
      ctx.request.passedParams = { query: qobj };
      await next();
    }
  };
}