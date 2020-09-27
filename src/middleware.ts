/**
 * koa-paramcheck
 */
import { ObjectRule, ArrayRule, QueryRule } from './type/rules';
import { handlerSwitch } from './handler';
import { parseJSONBody, resBadRequest, queryObjectToJSON } from './utils';
import { KoaMiddleware, KoaDefaultCtx } from './type/middleware';

declare module 'koa' {
  interface Request {
    // if http parameter pass the check, it will be parse and set to here
    passedParams?: {
      query?: any,
      body?: any
    }
  }
}

function setParams(ctx: KoaDefaultCtx, val: any, type: 'query' | 'body') {
  if (ctx.request.passedParams) {
    ctx.request.passedParams[type] = val;
  } else {
    ctx.request.passedParams = { [type]: val };
  }
}

export function jsonBodyCheck(rootRule: ObjectRule | ArrayRule): KoaMiddleware {
  return async (ctx, next) => {
    const [succeed, parsedJSON] = await parseJSONBody(ctx);
    if (!succeed) {
      resBadRequest('body', ctx, 'invalid JSON, only supports object and array');
      return;
    }
    const errMsg = handlerSwitch(parsedJSON, rootRule);
    if (errMsg) {
      resBadRequest('body', ctx, errMsg);
    } else {
      setParams(ctx, parsedJSON, 'body');
      await next();
    }
  }
}

export function queryCheck(rule: QueryRule): KoaMiddleware {
  return async (ctx, next) => {
    const qobj = queryObjectToJSON(rule, ctx.query);
    const errMsg = handlerSwitch(qobj, {
      type: 'object',
      allowNull: false,
      properties: rule.properties,
      requiredKeys: rule.requiredKeys || [],
      allowOtherKeys: true,
    });
    if (errMsg) {
      resBadRequest('query', ctx, errMsg);
    } else {
      setParams(ctx, qobj, 'query');
      await next()
    }
  }
}