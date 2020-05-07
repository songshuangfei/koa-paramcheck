/**
 * koa-paramcheck
 */
import * as Koa from "koa";
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
export declare type Rule = StringRule | NumberRule | BoolRule | ArrayRule | ObjectRule | AnyRule;
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
declare type QueryStringRule = StringRule;
interface QueryArrayRule {
    type: "array";
    itemRule: {
        regExp?: RegExp;
        message?: string;
    };
}
export declare type QueryRule = QueryStringRule | QueryArrayRule;
declare type AttrQueryRule = QueryStringRule & {
    key: string;
} | QueryArrayRule & {
    key: string;
};
/**
 * bodyCheck() precheck middleware for body;
 */
export declare function bodyCheck(rules: Array<AttrRule>): (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) => Promise<void>;
/**
 * queryCheck(), precheck middleware for query;
 */
export declare function queryCheck(rules: Array<AttrQueryRule>): (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next: Koa.Next) => Promise<void>;
export {};
