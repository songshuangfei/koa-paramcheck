import * as Parse from "co-body";
import { KoaDefaultCtx } from './type/middleware'

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

export async function parseJSONBody(ctx: KoaDefaultCtx): Promise<[boolean, any]> {
  try {
    const res = await Parse.json(ctx.req);
    return [true, res]
  } catch (error) {
    console.error(error)
    return [false, null]
  }
}

export function resBadRequest(paramType: 'body' | 'query', ctx: KoaDefaultCtx, msg: string): void {
  const key = paramType + 'Errors';
  ctx.status = 400;
  ctx.body = { [key]: msg.trim() };
}

