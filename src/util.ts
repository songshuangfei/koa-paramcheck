import * as Koa from "koa";
import * as Parse from "co-body";

export function getRange(min: number | undefined, max: number | undefined): string {
  let left = "", right = "";
  left = min === undefined ? "(-∞" : `[${min}`;
  right = max === undefined ? "+∞)" : `${max}]`;
  return `${left}, ${right}`;
}

/**
 * join attributes to a string
 * ["a",1,"b",0] -> "a[1].b[0]"
 */
export function joinAttrPath(arr: Array<string | number>): string {
  let res = "";
  arr.forEach((v) => {
    if (typeof v === "number") res += `[${v}]`
    else res += res ? `.${v}` : `${v}`
  })
  return res;
}

/**
* Judge if the body  is a application/json
*/
export async function isJSONBody(ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>): Promise<[boolean, any]> {
  //  if (ctx.request.headers['content-type'] !== 'application/json')
  //    return [false, null];
  try {
    const res = await Parse.json(ctx.req);
    return [true, res]
  } catch (error) {
    console.error(error)
    return [false, null]
  }
}


/**
* transfrom attributes in ctx.query to an Array(length === 1) by attributes keys
* and return a new query object
*/
export function transformQueryAttrtoArray(queryObj: any, keys: string[]): Promise<[boolean, any]> {
  const QObj = { ...queryObj };
  const objKeys = Reflect.ownKeys(QObj);
  keys.forEach(k => {
    if (!objKeys.includes(k)) 
      return;
    if (QObj[k] instanceof Array) 
      return;
    else QObj[k] = [QObj[k]];
  })
  return QObj;
}