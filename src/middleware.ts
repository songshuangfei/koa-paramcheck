/**
 * koa-paramcheck
 */
import { ObjectRule, ArrayRule } from './type/rules';
import { handlerSwitch } from './handler';
import { parseJSONBody, resBadRequest } from './utils';
import { KoaMiddleware } from './type/middleware';

declare module 'koa' {
  interface Request {
    // if http parameter pass the check, it will be parse and set to here
    passedParams?: {
      query?: any,
      body?: any
    }
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
      ctx.request.passedParams = { body: parsedJSON }
      await next();
    }
  }
}