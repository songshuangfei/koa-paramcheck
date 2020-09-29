<h1 align="center">koa-paramcheck</h1>
<p align="center">Koa middlewares, for parsing and checking query string or JSON body.</p>
<p align="center">
  <img src="https://img.shields.io/npm/v/koa-paramcheck" alt="npm version">
  <img src="https://img.shields.io/npm/l/koa-paramcheck" alt="license">
  <img src="https://img.shields.io/github/workflow/status/songshuangfei/koa-paramcheck/build/master" alt="build">
  <img src="https://img.shields.io/nycrc/songshuangfei/koa-paramcheck?config=.nycrc.json&preferredThreshold=lines" alt="coverage">
</p>

## Description
Koa middlewares for parsing and checking query and JSON body. Define a rule for this middleware as the first parameter. If the parameters of the http request do not match this rule, http will response with a 400 status code and a detailed error message.

## Install
```bash
npm install koa-paramcheck
```

## Example
```js
const Koa = require('koa');
const { queryCheck }  = require('koa-paramcheck');
const app = new Koa();

app.use(queryCheck({
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
})).use(async (ctx) => {
  console.log(ctx.request.passedParams.query);
  ctx.body = '';
});

app.listen(3000);
```
Test.
```bash
curl "localhost:3000?page=1&pageSize=30"
```
Response.
```
status: 400 Bad Request
body: {"queryErrors":"pageSize does not in range [1, 20]"}
```

## Documentation
* [Guide](doc/guide.md)
* [API](doc/API.md)

## License
MIT