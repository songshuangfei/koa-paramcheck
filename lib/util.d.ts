import * as Koa from "koa";
export declare function getRange(min: number | undefined, max: number | undefined): string;
/**
 * join attributes to a string
 * ["a",1,"b",0] -> "a[1].b[0]"
 */
export declare function joinAttrPath(arr: Array<string | number>): string;
/**
* Judge if the body  is a application/json
*/
export declare function isJSONBody(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>): Promise<[boolean, any]>;
