<h1 align="center">koa-paramcheck</h1>
<p align="center">Koa middlewares, for parsing and checking query string or JSON body.</p>
<p align="center">
  <img src="https://img.shields.io/npm/v/koa-paramcheck" alt="npm version">
  <img src="https://img.shields.io/github/workflow/status/songshuangfei/koa-paramcheck/build/master" alt="build">
  <img src="https://img.shields.io/nycrc/songshuangfei/koa-paramcheck?config=.nycrc.json&preferredThreshold=lines" alt="coverage">
</p>

```ts
import Koa from 'koa';
import { jsonBodyCheck, StringRule } from 'koa-paramcheck';
const app = new Koa();

const phoneNumberRule: StringRule = {
  type: 'string',
  regExp: /^[1]([3-9])[0-9]{9}$/,
  message: '{{path}} must be a phone number'
};

app.use(jsonBodyCheck({
  type: 'array',
  itemRule: phoneNumberRule,
  allowEmpty: false
})).use(async (ctx) => {
  console.log(ctx.request.passedParams?.body)
});
```

## Description
Koa middlewares for parsing and checking query and JSON body. Define a rule for this middleware as the first parameter. If the parameters of the http request do not match this rule, http will response with a 400 status code and a detailed error message.

## Install
```shell
npm install koa-paramcheck
```

## Use

### jsonBodyCheck
`jsonBodyCheck()`, Return a middleware based on `co-body`. It can parse and ckeck JSON body(object and array only).
```ts
import { jsonBodyCheck, StringRule, ObjectRule } from 'koa-paramcheck';

const phoneNumberRule: StringRule = {
  type: 'string',
  regExp: /^[1]([3-9])[0-9]{9}$/,
  message: '{{path}} must be a phone number'
};

const emailRule: StringRule = {
  type: 'string',
  regExp: /^\w+@[a-z0-9]\.[a-z]+$/i,
  message: '{{path}} must be an email.'
}

const nameRule: StringRule = {
  type: 'string',
  allowSpace: true,
  allowEmpty: false
}

const contactRule: ObjectRule = {
  type: 'object',
  properties: {
    name: nameRule,
    email: emailRule,
    phoneNumber: phoneNumberRule
  },
  requiredKeys: ['name', 'email']
}

app.use(jsonBodyCheck({
  type: 'object',
  properties: {
    contacts: {
      type: 'array',
      itemRule: contactRule
    },
    date: {
      type: 'string',
      allowNull: true
    }
  }
})).use(async (ctx) => {
  console.log(ctx.request.passedParams?.body)
});
```
## queryCheck

`queryCheck()`, Return a middleware, check the query and automatically convert the data type.
```ts
import { queryCheck } from 'koa-paramcheck';

app.use(queryCheck({
  properties: {
    keywords: {
      type: 'simpleArray',
      allowEmpty: false,
      itemRule: {
        type: 'string',
        allowEmpty: false
      }
    },
    page: {
      type: 'number',
      min: 1,
    },
    pageSize: {
      type: 'number',
      min: 1,
      max: 20
    }
  },
  requiredKeys: ['keywords', 'page', 'pageSize']
})).use(async (ctx) => {
  console.log(ctx.request.passedParams?.query)
});
```
## API

### Rule

#### StringRule
| option | description | type | default value |
|   :-   |     :-      |  :-  |      -:       |
|type|-|`'string'`|-|
|allowNull|Allow null value.|`boolean`|`false`|
|allowSpace|Allow space in string.|`boolean`|`true`|
|allowEmpty|Allow empty string.|`boolean`|`true`|
|regExp|Regex pattern|`RegExp`|`undefined`|
|message|regExp failed message|`string`|`undefined`|

#### NumberRule
| option | description | type | default value |
|   :-   |      :-     |  :-  |       :-      |
|type|-|`'number'`|-|
|allowNull|Allow null value.|`boolean`|`false`|
|max|Max value|`number`|`Infinity`|
|min|Min value|`number`|`-Infinity`|
|isInteger|Limit Integer|`boolean`|`false`|

#### BoolRule
| option | description | type | default value |
|   :-   |     :-      |  :-  |      -:       |
|type|-|`'boolean'`|-|
|allowNull|Allow null value.|`boolean`|`false`|

#### AnyRule
| option | description | type | default value |
|   :-   |     :-      |  :-  |      -:       |
|type|-|`'any'`|-|
|allowNull|Allow null value.|`boolean`|`false`|

#### ArrayRule
| option | description | type | default value |
|   :-   |     :-      |  :-  |      -:       |
|type|-|`'array'`|-|
|allowNull|Allow null value.|`boolean`|`false`|
|allowEmpty|Allow empty array.|`boolean`|`true`|
|itemRule|Rule of array item.|`StringRule \| NumberRule \| BoolRule \| ArrayRule \| ObjectRule \| AnyRule \| SimpleArrayRule`|-|

#### SimpleArrayRule
| option | description | type | default value |
|   :-   |     :-      |  :-  |      -:       |
|type|-|`'simpleArray'`|-|
|allowNull|Allow null value.|`boolean`|`false`|
|allowEmpty|Allow empty array.|`boolean`|`true`|
|itemRule|Rule of array item.|`StringRule \| BoolRule \| NumberRule`|-|

#### ObjectRule
| option | description | type | default value |
|   :-   |     :-      |  :-  |      -:       |
|type|-|`'object'`|-|
|allowNull|Allow null value.|`boolean`|`false`|
|properties|Properties rules.|`{ [key:string]: StringRule \| NumberRule \| BoolRule \| ArrayRule \| ObjectRule \| AnyRule \| SimpleArrayRule }`|-|
|requiredKeys|Required properties|`string[]`|`[]`|
|allowOtherKeys|Allow other properties|`boolean`|`true`|

#### QueryRule
| option | description | type | default value |
|   :-   |     :-      |  :-  |      -:       |
|properties|Properties rules.|`{ [key:string]: StringRule \| BoolRule \| NumberRule \| SimpleArrayRule }`|-|
|requiredKeys|Required properties|`string[]`|`[]`|

### Middleware
| name | description | param type | return |
|  :-  |      :-     |  :-   |   -:   |
|jsonBodyCheck|Parse and ckeck JSON body.|`ObjectRule \| ArrayRule` |Koa MiddleWare|
|queryCheck|Check the query and automatically convert the data type.|`QueryRule`|Koa MiddleWare|

### ctx.request.passedParams
| path | description | value |
|  :-  |      :-     |  :-   |
|ctx.request.passedParams|Passed param|`{ query?: any, body?: any} \| undefined`|
|ctx.request.passedParams.body|Passed body|`Object \| undefined`|
|ctx.request.passedParams.query|Passed query|`Object \| undefined`|

## License

MIT