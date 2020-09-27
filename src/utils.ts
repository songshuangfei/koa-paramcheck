import * as Parse from "co-body";
import { KoaDefaultCtx } from './type/middleware';
import { QueryRule } from './type/rules';

export function removeStrSpace(str: string) {
  return str.replace(/\s+/g, '')
}

export function isObject(val: any) {
  if (val === null) return false;
  if (typeof val === 'object' && !(val instanceof Array))
    return true;
  return false;
}

export class AttrPath {
  private data: Array<string | number>
  constructor(source?: Array<string | number>) {
    this.data = source ? [...source] : [];
  }

  clone(): AttrPath {
    return new AttrPath(this.data);
  }

  join(): string {
    let res = '';
    this.data.forEach((v) => {
      if (typeof v === 'number') res += `[${v}]`
      else res += res ? `.${v}` : `${v}`
    })
    return res;
  }

  push(v: string | number) {
    this.data.push(v);
    return this;
  }
}

export function resBadRequest(paramType: 'body' | 'query', ctx: KoaDefaultCtx, msg: string): void {
  const key = paramType + 'Errors';
  ctx.status = 400;
  ctx.body = { [key]: msg.trim() };
}

export async function parseJSONBody(ctx: KoaDefaultCtx): Promise<[boolean, any]> {
  try {
    const res = await Parse.json(ctx.req);
    return [true, res]
  } catch (error) {
    console.error(error)
    return [false, null]
  }
}

// try to convert query object to a typed JSON. 
// {page: '1', size: '10'} -> {page: 1, size: 10}
export function queryObjectToJSON(queryRule: QueryRule, queryObject: { [key: string]: any }): { [key: string]: any } {
  const ruleKeys = Object.keys(queryRule.properties);
  const res: { [key: string]: any } = { ...queryObject };
  for (const key of ruleKeys) {
    const attrRule = queryRule.properties[key];
    const attrVal = queryObject[key];

    if (attrRule.type === 'boolean' || attrRule.type === 'number' || attrRule.type === 'string') {
      if (!attrVal) continue;
      res[key] = coverVal(attrVal, attrRule.type);
      continue;
    }

    if (attrRule.type === 'simpleArray') {
      if (!attrVal)
        res[key] = [];
      if (attrVal instanceof Array)
        res[key] = attrVal.map(v => coverVal(v, attrRule.itemRule.type));
      else
        res[key] = [coverVal(attrVal, attrRule.itemRule.type)];
    }
  }
  return res;
}

// try to convert value
function coverVal(val: any, type: 'boolean' | 'number' | 'string'): any {
  if (type === 'boolean') {
    if (val === 'true') return true;
    if (val === 'false') return false;
  }
  if (type === 'number') {
    const n = Number(val);
    if (!Number.isNaN(n)) return n;
  }
  if (type === 'string') return val;
  return val;
}

