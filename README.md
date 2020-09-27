<h1 align="center">koa-paramcheck</h1>
<p align="center">Koa middlewares, for parsing and checking query string or JSON body.</p>
<p align="center">
  <img src="https://img.shields.io/npm/v/koa-paramcheck" alt="npm version">
  <img src="https://img.shields.io/github/workflow/status/songshuangfei/koa-paramcheck/build/master" alt="build">
  <img src="https://img.shields.io/nycrc/songshuangfei/koa-paramcheck?config=.nycrc.json&preferredThreshold=lines" alt="coverage">
</p>

```ts
import Koa from "koa";
import { jsonBodyCheck, StringRule } from "koa-paramcheck";
const app = new Koa();

const phoneNumberRule: StringRule = {
  type: 'string',
  regExp: /^[1]([3-9])[0-9]{9}$/,
  message: '{{path}} must be a phone number'
};

app.use(jsonBodyCheck({
  type: "array",
  itemRule: phoneNumberRule,
  allowEmpty: false
})).use(async (ctx) => {
  console.log(ctx.request.passedParams?.body)
});
```

## Description
Koa middlewares for parsing and checking query and JSON body. Define a rule for this middleware as the first parameter. If the parameters of the http request do not match this rule, http will response with a 400 status code and a detailed error message;

## Use

### jsonBodyCheck
`jsonBodyCheck`, a middleware based on `co-body`. It can parse and ckeck JSON body(object and array only).
```ts
import { jsonBodyCheck, StringRule, ObjectRule } from "koa-paramcheck";

const phoneNumberRule: StringRule = {
  type: 'string',
  regExp: /^[1]([3-9])[0-9]{9}$/,
  message: '{{path}} must be a phone number'
};

const emailRule: StringRule = {
  type: "string",
  regExp: /^\w+@[a-z0-9]\.[a-z]+$/i,
  message: "{{path}} must be an email."
}

const contactRule: ObjectRule = {
  type: "object",
  properties: {
    name: {
      type: "string",
      allowEmpty: false,
    },
    email: emailRule,
    phoneNumber: phoneNumberRule
  },
  requiredKeys: ["name", "email"]
}

// define a JSON body like 
// {
//   contacts: Array<{
//     name: string,
//     email: string,
//     phoneNumber: string
//   }>,
//   date: string
// }
app.use(jsonBodyCheck({
  type: "object",
  properties: {
    contacts: {
      type: "array",
      itemRule: contactRule
    },
    date: {
      type: "string",
      allowNull: true
    }
  }
})).use(async (ctx) => {
  console.log(ctx.request.passedParams?.body)
});
```
## queryCheck
`queryCheck`, middleware, check the query and automatically convert the data type.
```ts
import { queryCheck } from "koa-paramcheck";
// defined a query body like 
// {
//   page: number,
//   pageSize: number,
//   keyWords: Array<string>
// }
app.use(queryCheck({
  properties: {
    keywords: {
      type: "simpleArray",
      allowEmpty: false,
      itemRule: {
        type: 'string',
        allowEmpty: false
      }
    },
    page: {
      type: "number",
      min: 1,
    },
    pageSize: {
      type: "number",
      min: 1,
      max: 20
    }
  },
  requiredKeys: ["keywords", "page", "pageSize"]
})).use(async (ctx) => {
  console.log(ctx.request.passedParams?.query)
});
```