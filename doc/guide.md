# koa-paramcheck guide

## Install
```shell
npm i koa-paramcheck
```
or
```shell
yarn add koa-paramcheck
```

## Use

### Create a koa app
```js
// app.js
const Koa = require('koa');
const { checkUserInfo, checkSearch } = require('./middlewares');
const app = new Koa();

app.use(async (ctx) => {
  ctx.body = '';
});

app.listen(3000);
```

### Create a middlware
Create a middleware for parsing and checking the body.
```js
// middlewares.js
const { jsonBodyCheck } = require('koa-paramcheck');

exports.checkUserInfo = jsonBodyCheck({
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' },
    sex: { type: 'string'},
  },
  requiredKeys: ['name']
});

```
Create a middleware for checking the query.
```js
// middlewares.js
const { queryCheck } = require('koa-paramcheck');

exports.checkSearch = queryCheck({
  properties: {
    keyword: { 
      type: 'string',
      allowEmpty: false
    }
  },
  requiredKeys: ['keyword']
});
```
### Use the middleware.
```js
// app.js
const Koa = require('koa');
const { checkUserInfo, checkSearch } = require('./middlewares');
const app = new Koa();

app.use(checkUserInfo).use(checkSearch);

app.use(async (ctx) => {
  const q = ctx.request.passedParams.query;
  const b = ctx.request.passedParams.body;
  ctx.body = { query: q, body: b };
});

app.listen(3000);
```
### Use in typescript
Let's define some complex rules in typescript.
```ts
// middlewares.ts
import { jsonBodyCheck, StringRule, ObjectRule, NumberRule, queryCheck } from 'koa-paramcheck';

const phoneNumberRule: StringRule = {
  type: 'string',
  pattern: /^[1]([3-9])[0-9]{9}$/,
  message: '{{path}} must be a phone number'
};

const emailRule: StringRule = {
  type: 'string',
  pattern: /^\w+@[a-z0-9]\.[a-z]+$/i,
  message: '{{path}} must be an email.'
};

const nameRule: StringRule = {
  type: 'string',
  allowSpace: true,
  allowEmpty: false
};

const ageRule: NumberRule = {
  type: 'number',
  min: 0,
  max: 150
}

const contactRule: ObjectRule = {
  type: 'object',
  properties: {
    name: nameRule,
    age: ageRule,
    email: emailRule,
    phoneNumber: phoneNumberRule
  },
  requiredKeys: ['name', 'email']
};

export const checkContacts = jsonBodyCheck({
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
  },
  requiredKeys:['contacts']
});

export const searchCheck = queryCheck({
  properties: {
    keyword: {
      type: 'string',
      allowEmpty: false
    },
    page: {
      type: 'number',
      min: 1
    },
    pageSize: {
      type: 'number',
      min: 1,
      max: 20
    }
  },
  requiredKeys: ['page', 'pageSize']
});
```

## With koa-router
```ts
import Koa from 'koa';
import Router from 'koa-router';
import { checkContacts, searchCheck } from './middlewares';

const app = new Koa();
const router = new Router();

router.post('/contacts', checkContacts, async (ctx) => {
  console.log(ctx.request.passedParams?.body);
  ctx.body = 'succeed';
});

router.get('/search', searchCheck, async (ctx) => {
  console.log(ctx.request.passedParams?.query);
  ctx.body = 'succeed';
});

app.use(router.routes())

app.listen(3000);
```