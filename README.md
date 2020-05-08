# koa param check
A koa middleware for checking querystring and JSON body.
Define a rule for this middleware as the first parameter. If the parameters of the http request do not match this rule, http will response with a 400 status code and a detailed error message;

## install
```bash
npm i koa-paramcheck
```
## usage
In javascript.
```js
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { jsonBodyCheck, queryCheck } from "koa-paramcheck";

const app = new Koa();
app.use(bodyParser()); //This is neccessary, or bodyCheck will not work

const router = new Router();
router.get("/search", queryCheck([
  {
    type: "string",
    key: "num", regExp: /^[0-9]*$/,
    message: "{{path}} must be number string"
  },
  {
    type: "array", 
    key: "strs", 
    itemRule: {
      regExp: /^[a-z]+$/,
    }
  },
]), async (ctx) => {
  ctx.body = { succeed: true }
})

router.post("/register", jsonBodyCheck([
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
    ]
  }
]), async (ctx) => {
  ctx.body = { succeed: true }
})
app.use(router.routes()).use(router.allowedMethods());
app.listen("8081");

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
  ctx.body = { succeed: true }
})

const phoneNumberRule: Rule = {
  type: "string",
  regExp: /^[1]([3-9])[0-9]{9}$/,
  message: "{{path}} must be a phone number"
}

router.post("/contacts", jsonBodyCheck([
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
]), async (ctx) => {
  ctx.body = { succeed: true }
})
```
## test

```bash
$ curl "http://127.0.0.1:8081/search?num=123s&strs=abc&strs=abc1"
{"queryError":"num must be number string; strs[1] dose not match /^[a-z]+$/; "}

$ curl " curl -H "Content-Type:application/json"  -d '{"phoneNumber":"15000000000"}' http://127.0.0.1:8081/register"
{"bodyError":"verifyCode is required; pwd is required; tags is required; info is required; "}
```
