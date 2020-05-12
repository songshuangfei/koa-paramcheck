/**
 * koa-paramcheck
 */
import * as Koa from "koa";
declare module "koa" {
    interface Request {
        passedParams: {
            query?: any;
            body?: any;
        };
    }
}
declare type KoaMiddleware = (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) => any;
/**
 * rules used to check
 */
interface StringRule {
    type: "string";
    regExp?: RegExp;
    message?: string;
}
interface NumberRule {
    type: "number";
    max?: number;
    min?: number;
}
interface BoolRule {
    type: "boolean";
}
interface AnyRule {
    type: "any";
}
interface ArrayRule {
    type: "array";
    itemRule: Rule;
    allowEmpty?: boolean;
}
interface ObjectRule {
    type: "object";
    attrRules: Array<AttrRule>;
    allowOtherKeys?: boolean;
}
export declare type Rule = StringRule | NumberRule | BoolRule | ArrayRule | ObjectRule | AnyRule;
declare type AttrRule = Rule & {
    key: string;
};
declare type JSONType = ArrayRule | ObjectRule;
/**
 * jsonBodyCheck() precheck  for application/json body;
 * json can be array or object
 */
export declare function jsonBodyCheck(rootRule: JSONType): KoaMiddleware;
export declare type QueryRule = StringRule | {
    type: "array";
    itemRule: Omit<StringRule, "type">;
    allowEmpty?: boolean;
};
declare type AttrQueryRule = QueryRule & {
    key: string;
};
/**
 * queryCheck(), precheck for query
 */
export declare function queryCheck(rules: Array<AttrQueryRule>): KoaMiddleware;
export {};
