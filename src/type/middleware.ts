import * as Koa from 'koa';

export type KoaDefaultCtx = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>;
export type KoaMiddleware = (ctx: KoaDefaultCtx, next: Koa.Next) => any;