export function removeStrSpace(str: string) {
  return str.replace(/\s+/g, "")
}

export function isObject(val: any) {
  if (val === null) return false;
  if (typeof val === 'object' && !(val instanceof Array))
    return true;
  return false;
}

export class  AttrPath {
  private data:Array<string|number>
  constructor(source?: Array<string | number>) {
    this.data = source ? [...source] : [];
  }

  clone():AttrPath{
    return new AttrPath(this.data);
  }
  
  join():string{
    let res = '';
    this.data.forEach((v) => {
      if (typeof v === 'number') res += `[${v}]`
      else res += res ? `.${v}` : `${v}`
    })
    return res;
  }

  push(v:string|number){
    this.data.push(v);
    return this;
  }
}


