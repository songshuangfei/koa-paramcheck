"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
/**
 * stringHandler() string check
 * @param attrPath used to record the attribute path
 * @param value current value to check
 * @param rule current rule, used to check value
 */
function stringHandler(attrPath, value, rule) {
    var path = util_1.joinAttrPath(attrPath);
    if (typeof value !== "string")
        return path + " must be a string; ";
    if (rule.regExp && !rule.regExp.test(value)) {
        if (rule.message)
            return rule.message.replace("{{path}}", path) + "; ";
        else
            return path + " dose not match " + rule.regExp.toString() + "; ";
    }
    return null;
}
function numberHandler(attrPath, value, rule) {
    var path = util_1.joinAttrPath(attrPath);
    if (typeof value !== "number")
        return path + " must be a number; ";
    var min = rule.min, max = rule.max;
    if ((min !== undefined && value < min) || (max !== undefined && value > max))
        return path + " must be in range" + util_1.getRange(min, max) + "; ";
    return null;
}
function booleanHandler(attrPath, value, rule) {
    if (typeof value !== "boolean")
        return util_1.joinAttrPath(attrPath) + " must be a boolean; ";
    return null;
}
function anyHandler(attrPath, value, rule) {
    if (value === undefined) {
        return util_1.joinAttrPath(attrPath) + " is required; ";
    }
    return null;
}
/**
 * arrayHandler() check the array data according to ArrayRule
 * @param attrPath
 * @param value
 * @param rule
 */
function arrayHandler(attrPath, value, rule) {
    var e_1, _a;
    //Is value an array
    if (!(value instanceof Array))
        return util_1.joinAttrPath(attrPath) + " must be an Array; ";
    //Is this array empty
    if (!rule.allowEmpty && value.length === 0)
        return util_1.joinAttrPath(attrPath) + " can not ba an empty array; ";
    var errs = [];
    try {
        // find error of each array item
        for (var _b = __values(value.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), index = _d[0], itemValue = _d[1];
            var nextAttrPath = __spread(attrPath, [index]);
            var err = HandlerSwitch(nextAttrPath, itemValue, rule.itemRule);
            if (err)
                errs.push(err);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return errs.length === 0 ? null : errs.join("");
}
/**
 * objectHandler() check the received JSON string or object in JSON
 * @param attrPath record the attribute path
 * @param value current value to check
 * @param rule current rule, used to check velue
 */
function objectHandler(attrPath, value, rule) {
    var e_2, _a;
    //Is value an object
    if (value instanceof Array || typeof value !== 'object')
        return util_1.joinAttrPath(attrPath) + " must be an object; ";
    //The errors of the attributes in the object
    var errs = [];
    var objKeys = Reflect.ownKeys(value);
    try {
        for (var _b = __values(rule.attrRules), _c = _b.next(); !_c.done; _c = _b.next()) {
            var attrRule = _c.value;
            //attribute path of the object
            var nextAttrPath = __spread(attrPath, [attrRule.key]);
            // Is the defined key missed in the object
            if (!objKeys.includes(attrRule.key)) {
                errs.push(util_1.joinAttrPath(nextAttrPath) + " is required; ");
                continue;
            }
            //current attribute value
            var attrValue = value[attrRule.key];
            //error of current attribute
            var err = HandlerSwitch(nextAttrPath, attrValue, attrRule);
            if (err)
                errs.push(err);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    //find the keys witch are not defined in the object attributes rules
    if (!rule.allowOtherKeys) {
        var allowedKeys_1 = rule.attrRules.map(function (i) { return i.key; });
        objKeys.forEach(function (key) {
            var pathStr = util_1.joinAttrPath(__spread(attrPath, [String(key)]));
            if (!allowedKeys_1.includes(String(key)))
                errs.push(pathStr + " is not allowed; ");
        });
    }
    return errs.length === 0 ? null : errs.join("");
}
function HandlerSwitch(attrPath, value, rule) {
    var err = null;
    switch (rule.type) {
        case "string":
            err = stringHandler(attrPath, value, rule);
            break;
        case "number":
            err = numberHandler(attrPath, value, rule);
            break;
        case "boolean":
            err = booleanHandler(attrPath, value, rule);
            break;
        case "any":
            err = anyHandler(attrPath, value, rule);
            break;
        case "array":
            err = arrayHandler(attrPath, value, rule);
            break;
        case "object":
            err = objectHandler(attrPath, value, rule);
            break;
    }
    if (err)
        return err;
    return null;
}
/**
 * jsonBodyCheck() precheck  for application/json body;
 * json can be array or object
 */
function jsonBodyCheck(rootRule) {
    var _this = this;
    return function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, succeed, parsedJSON, bodyErrMsg;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, util_1.isJSONBody(ctx)];
                case 1:
                    _a = __read.apply(void 0, [_b.sent(), 2]), succeed = _a[0], parsedJSON = _a[1];
                    if (!succeed) {
                        ctx.status = 400;
                        ctx.body = { bodyError: "invalid JSON, only supports object and array; " };
                        return [2 /*return*/];
                    }
                    bodyErrMsg = HandlerSwitch([], parsedJSON, rootRule);
                    if (!bodyErrMsg) return [3 /*break*/, 2];
                    ctx.status = 400;
                    ctx.body = { bodyError: bodyErrMsg };
                    return [3 /*break*/, 4];
                case 2:
                    ctx.request.passedParams = { body: parsedJSON };
                    return [4 /*yield*/, next()];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
}
exports.jsonBodyCheck = jsonBodyCheck;
/**
 * queryCheck(), precheck for query
 */
function queryCheck(rules) {
    var _this = this;
    return function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        var qobj, queryObjectRule, queryErrMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    qobj = util_1.transformQueryAttrtoArray(ctx.query, rules.filter(function (i) { return i.type === "array"; }).map(function (i) { return i.key; }));
                    queryObjectRule = {
                        type: "object",
                        attrRules: rules.map(function (r) {
                            if (r.type === "string")
                                return r;
                            else
                                return __assign(__assign({}, r), { itemRule: __assign(__assign({}, r.itemRule), { type: "string" }) });
                        })
                    };
                    queryErrMsg = HandlerSwitch([], qobj, queryObjectRule);
                    if (!queryErrMsg) return [3 /*break*/, 1];
                    ctx.status = 400;
                    ctx.body = { queryError: queryErrMsg };
                    return [3 /*break*/, 3];
                case 1:
                    ctx.request.passedParams = { query: qobj };
                    return [4 /*yield*/, next()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
exports.queryCheck = queryCheck;
