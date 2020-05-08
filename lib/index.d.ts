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
}
interface ObjectRule {
    type: "object";
    attrRules: Array<AttrRule>;
}
declare type QueryStringRule = StringRule;
interface QueryArrayRule {
    type: "array";
    itemRule: {
        regExp?: RegExp;
        message?: string;
    };
}
export declare type Rule = StringRule | NumberRule | BoolRule | ArrayRule | ObjectRule | AnyRule;
export declare type QueryRule = QueryStringRule | QueryArrayRule;
declare type AttrRule = StringRule & {
    key: string;
} | NumberRule & {
    key: string;
} | BoolRule & {
    key: string;
} | ArrayRule & {
    key: string;
} | ObjectRule & {
    key: string;
} | AnyRule & {
    key: string;
};
declare type AttrQueryRule = QueryStringRule & {
    key: string;
} | QueryArrayRule & {
    key: string;
};
/**
 * jsonBodyCheck() precheck  for application/json body;
 */
export declare function jsonBodyCheck(rules: Array<AttrRule>): (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) => Promise<void>;
/**
 * queryCheck(), precheck for query
 */
export declare function queryCheck(rules: Array<AttrQueryRule>): (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) => Promise<void>;
export {};
