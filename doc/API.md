# koa-paramcheck API

## Rule

### StringRule
| option | description | type | default value |
|   :-   |     :-      |  :-  |      -:       |
|type|-|`'string'`|-|
|allowNull|Allow null value.|`boolean`|`false`|
|allowSpace|Allow space in string.|`boolean`|`true`|
|allowEmpty|Allow empty string.|`boolean`|`true`|
|pattern|Regex pattern|`RegExp`|`undefined`|
|message|Pattern match failed message|`string`|`undefined`|

### NumberRule
| option | description | type | default value |
|   :-   |      :-     |  :-  |       :-      |
|type|-|`'number'`|-|
|allowNull|Allow null value.|`boolean`|`false`|
|max|Max value|`number`|`Infinity`|
|min|Min value|`number`|`-Infinity`|
|isInteger|Limit Integer|`boolean`|`false`|

### BoolRule
| option | description | type | default value |
|   :-   |     :-      |  :-  |      -:       |
|type|-|`'boolean'`|-|
|allowNull|Allow null value.|`boolean`|`false`|

### AnyRule
| option | description | type | default value |
|   :-   |     :-      |  :-  |      -:       |
|type|-|`'any'`|-|
|allowNull|Allow null value.|`boolean`|`false`|

### ArrayRule
| option | description | type | default value |
|   :-   |     :-      |  :-  |      -:       |
|type|-|`'array'`|-|
|allowNull|Allow null value.|`boolean`|`false`|
|allowEmpty|Allow empty array.|`boolean`|`true`|
|itemRule|Rule of array item.|`StringRule \| NumberRule \| BoolRule \| ArrayRule \| ObjectRule \| AnyRule \| SimpleArrayRule`|-|

### SimpleArrayRule
| option | description | type | default value |
|   :-   |     :-      |  :-  |      -:       |
|type|-|`'simpleArray'`|-|
|allowNull|Allow null value.|`boolean`|`false`|
|allowEmpty|Allow empty array.|`boolean`|`true`|
|itemRule|Rule of array item.|`StringRule \| BoolRule \| NumberRule`|-|

### ObjectRule
| option | description | type | default value |
|   :-   |     :-      |  :-  |      -:       |
|type|-|`'object'`|-|
|allowNull|Allow null value.|`boolean`|`false`|
|properties|Properties rules.|`{ [key:string]: StringRule \| NumberRule \| BoolRule \| ArrayRule \| ObjectRule \| AnyRule \| SimpleArrayRule }`|-|
|requiredKeys|Required properties|`string[]`|`[]`|
|allowOtherKeys|Allow other properties|`boolean`|`true`|

### QueryRule
| option | description | type | default value |
|   :-   |     :-      |  :-  |      -:       |
|properties|Properties rules.|`{ [key:string]: StringRule \| BoolRule \| NumberRule \| SimpleArrayRule }`|-|
|requiredKeys|Required properties|`string[]`|`[]`|

## Middleware

### jsonBodyCheck
`jsonBodyCheck()`, Return a middleware based on `co-body`. It can parse and ckeck JSON body(object and array only).
| name | description | param type | return |
|  :-  |      :-     |  :-   |   -:   |
|jsonBodyCheck|Parse and ckeck JSON body.|`ObjectRule \| ArrayRule` |Koa MiddleWare|

### queryCheck
`queryCheck()`, Return a middleware, check the query and automatically convert the data type.
| name | description | param type | return |
|  :-  |      :-     |  :-   |   -:   |
|queryCheck|Check the query and automatically convert the data type.|`QueryRule`|Koa MiddleWare|

## ctx.request.passedParams
| path | description | value |
|  :-  |      :-     |  :-   |
|ctx.request.passedParams|Passed param|`{ query?: any, body?: any} \| undefined`|
|ctx.request.passedParams.body|Passed body|`Object \| undefined`|
|ctx.request.passedParams.query|Passed query|`Object \| undefined`|
