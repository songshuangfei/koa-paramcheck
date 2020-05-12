# koa param check
A Koa middleware for parsing and checking query and JSON body .
Define a rule for this middleware as the first parameter. If the parameters of the http request do not match this rule, http will response with a 400 status code and a detailed error message;

## install
```bash
npm i koa-paramcheck
```
## usage
In javascript.
```js
import Koa from "koa";
import Router from "koa-router";
import { jsonBodyCheck, queryCheck } from "koa-paramcheck";

const app = new Koa();
const router = new Router();

//Define query rule
router.get("/search", queryCheck([
  { type: "string", key: "str" },
  {
    type: "array",
    key: "bools",
    itemRule: {
      message: "{{path}} must be a boolean",
      regExp: /(true)|(false)$/i
    }
  },
]), async (ctx) => {
  const query = ctx.request.passedParams.query;
  ctx.body = { query }
})

//Define object JSON rule
router.post("/register", jsonBodyCheck({
  type:"object",
  allowOtherKeys:true,
  attrRules:[
    { type: "string", key: "verifyCode" },
    { type: "string", key: "pwd" },
    {
      type: "string",
      key: "phoneNumber",
      regExp: /^[1]([3-9])[0-9]{9}$/,
      message: "{{path}} must be a phone number"
    },
    {
      type: "array", 
      key: "tags", 
      itemRule: {
        type: "string"
      }
    },
    {
      type: "object", 
      key: "info", 
      attrRules: [
        { type: "string", key: "nickName" },
        { type: "number", key: "age", min: 0 },
        { type: "array", key: "jobs", itemRule:{
          type:"object",
          attrRules:[
            {type:"string",key:"industry"},
            {type:"string",key:"jobName"},
            {type:"number", key:"workingYears", min:0},
          ]
        } },
      ],
    }
  ]
}), async (ctx) => {
  const body = ctx.request.passedParams.body;
  ctx.body = { body };
})

//Define array JSON rule
router.post("/add-tags", jsonBodyCheck({
  type:"array",
  allowEmpty:false,
  itemRule:{
    type: "string",
  }
}), async (ctx) => {
  const body = ctx.request.passedParams.body;
  ctx.body = { body };
})
```
In typescript, you can define the rules clearly. 
```ts
import { jsonBodyCheck, queryCheck, Rule, QueryRule } from "koa-paramcheck";

const numberStringRule: QueryRule = {
  type: "string",
  regExp: /^[0-9]*$/,
  message: "{{path}} must be number string"
}

router.get("/search2", queryCheck([
  { key: "num", ...numberStringRule },
  { type: "array", key: "nums", itemRule: numberStringRule },
]), async (ctx) => {
  ctx.body = { 
    query:ctx.request.passedParams.query
  }
})

const phoneNumberRule: Rule = {
  type: "string",
  regExp: /^[1]([3-9])[0-9]{9}$/,
  message: "{{path}} must be a phone number"
}

router.post("/contacts", jsonBodyCheck({
  type:"object",
  attrRules:[
    { key: "myPhoneNumber", ...phoneNumberRule },
    {
      key: "myFriendsPhoneNumbers",
      type: "array",
      itemRule: phoneNumberRule
    },
    {
      key: "myFamilyPhoneNumbers",
      type: "object",
      attrRules: [
        { key: "myFather", ...phoneNumberRule },
        { key: "myMother", ...phoneNumberRule }
      ]
    }
  ]
}), async (ctx) => {
  ctx.body = { 
    body:ctx.request.passedParams.body
  }
})
```
## test
```bash
$ curl http://localhost:3001/register -d '{"phoneNumber":"15000000000"}'
{"bodyError":"verifyCode is required; pwd is required; tags is required; info is required; "}
```

## api
### JSON
* rules
  |rule type| data type | rule |
  |:-| :-| :---- |
  | `StringRule` | string | `{type: "string", regExp?: RegExp, message?: string}` |
  | `NumberRule` | number | `{type: "number", max?: number, min?: number}`|
  | `BoolRule` | boolean | `{type: "boolean"}`|
  | `AnyRule` | any | `{type: "any"}`|
  | `ArrayRule` | array | `{type: "array", itemRule: StringRule | NumberRule | BoolRule | AnyRule | ArrayRule | ObjectRule, allowEmpty?: boolean}`|
  | `AnyRule` | any | `{type: "any"}`|
  | `ObjectRule` | object | `{type: "object", attrRules: Array<StringRule&{key:string} | NumberRule&{key:string} | BoolRule&{key:string} | AnyRule&{key:string} | ArrayRule&{key:string} | ObjectRule&{key:string}>,  allowOtherKeys?: boolean}`|

* middleware
  |middlware| param |
  |:-| :-|
  | `jsonBodyCheck(param)` | `ArrayRule | ObjectRule` |

### query
* rules
  |rule type| data type | rule |
  |:-| :-| :---- |
  |`StringRule`| string | `{type: "string", regExp?: RegExp, message?: string}` |
  |`ArrayRule`| array| `{type: "array", allowEmpty?: boolean, itemRule:Omit<StringRule, "type">}` |
* middleware
  |middlware| param |
  |:-| :-|
  | `queryCheck(param)` | `ArrayRule&{key:string} | StringRule&{key:string} ` |
