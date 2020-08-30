/**
 * koa-paramcheck
 */
import * as Koa from 'koa';
declare module 'koa' {
  interface Request {
    // if http parameter pass the check, it will be parse and set to here
    passedParams:{
      query?: any,
      body?: any
    }
  }
}

type KoaMiddleware = (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) =>any;


export const a =1
