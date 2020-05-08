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
/**
 * join attributes to a string
 * ["a",1,"b",0] -> "a[1].b[0]"
 */
function joinAttrPath(arr) {
    var res = "";
    arr.forEach(function (v) {
        if (typeof v === "number")
            res += "[" + v + "]";
        else
            res += res ? "." + v : "" + v;
    });
    return res;
}
function getRange(min, max) {
    var left = "", right = "";
    left = min === undefined ? "(-∞" : "[" + min;
    right = max === undefined ? "+∞)" : max + "]";
    return left + ", " + right + "; ";
}
/**
 * Judge if the `ctx.request.rawBody` provide by koa-bodyparser is a application/json
 */
function isJSONBody(ctx) {
    if (ctx.request.headers['content-type'] !== 'application/json')
        return false;
    try {
        JSON.stringify(ctx.request.rawBody);
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
/**
 * objectHandler() string check
 * @param attrPath used to record the attribute path
 * @param value current value to check
 * @param rule current rule, used to check value
 */
function stringHandler(attrPath, value, rule) {
    var path = joinAttrPath(attrPath);
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
    var path = joinAttrPath(attrPath);
    if (typeof value !== "number")
        return path + " must be a number; ";
    var min = rule.min, max = rule.max;
    if ((min !== undefined && value < min) || (max !== undefined && value > max))
        return path + " must be in range" + getRange(min, max);
    return null;
}
function booleanHandler(attrPath, value, rule) {
    if (typeof value !== "boolean")
        return joinAttrPath(attrPath) + " must be a boolean; ";
    return null;
}
function anyHandler(attrPath, value, rule) {
    if (value === undefined) {
        return joinAttrPath(attrPath) + " is required; ";
    }
    return null;
}
function arrayHandler(attrPath, value, rule) {
    var e_1, _a;
    if (!(value instanceof Array))
        return joinAttrPath(attrPath) + " must be an Array; ";
    var errs = [];
    try {
        for (var _b = __values(value.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var arrayItem = _c.value;
            var nextAttrPath = __spread(attrPath, [arrayItem[0]]);
            var attrValue = value[arrayItem[0]];
            var err = null;
            switch (rule.itemRule.type) {
                case "string":
                    err = stringHandler(nextAttrPath, attrValue, rule.itemRule);
                    break;
                case "number":
                    err = numberHandler(nextAttrPath, attrValue, rule.itemRule);
                    break;
                case "boolean":
                    err = booleanHandler(nextAttrPath, attrValue, rule.itemRule);
                    break;
                case "any":
                    err = anyHandler(nextAttrPath, attrValue, rule.itemRule);
                    break;
                case "array":
                    err = arrayHandler(nextAttrPath, attrValue, rule.itemRule);
                    break;
                case "object":
                    err = objectHandler(nextAttrPath, attrValue, rule.itemRule);
                    break;
            }
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
    if (errs.length === 0)
        return null;
    return errs.join("");
}
/**
 * objectHandler() object check
 * @param attrPath record the attribute path
 * @param value current value to check
 * @param rule current rule, used to check velue
 */
function objectHandler(attrPath, value, rule) {
    var e_2, _a;
    if (value instanceof Array || typeof value !== 'object')
        return joinAttrPath(attrPath) + " must be an object; ";
    var errs = [];
    var bodyKeys = Reflect.ownKeys(value);
    try {
        for (var _b = __values(rule.attrRules), _c = _b.next(); !_c.done; _c = _b.next()) {
            var attrRule = _c.value;
            var nextAttrPath = __spread(attrPath, [attrRule.key]);
            if (!bodyKeys.includes(attrRule.key)) {
                errs.push(joinAttrPath(nextAttrPath) + " is required; ");
                continue;
            }
            var attrValue = value[attrRule.key];
            var err = null;
            switch (attrRule.type) {
                case "string":
                    err = stringHandler(nextAttrPath, attrValue, attrRule);
                    break;
                case "number":
                    err = numberHandler(nextAttrPath, attrValue, attrRule);
                    break;
                case "boolean":
                    err = booleanHandler(nextAttrPath, attrValue, attrRule);
                    break;
                case "any":
                    err = anyHandler(nextAttrPath, attrValue, attrRule);
                    break;
                case "array":
                    err = arrayHandler(nextAttrPath, attrValue, attrRule);
                    break;
                case "object":
                    err = objectHandler(nextAttrPath, attrValue, attrRule);
                    break;
            }
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
    if (errs.length === 0)
        return null;
    return errs.join("");
}
/**
 * jsonBodyCheck() precheck middleware for JSON body;
 */
function jsonBodyCheck(rules) {
    var _this = this;
    return function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        var reqBody, bodyErrMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isJSONBody(ctx)) {
                        ctx.body = { bodyError: "body must be a JSON" };
                        return [2 /*return*/];
                    }
                    reqBody = JSON.stringify(ctx.request.rawBody);
                    bodyErrMsg = objectHandler([], reqBody, {
                        type: "object",
                        attrRules: rules,
                    });
                    if (!bodyErrMsg) return [3 /*break*/, 1];
                    ctx.status = 400;
                    ctx.body = { bodyError: bodyErrMsg };
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, next()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
exports.jsonBodyCheck = jsonBodyCheck;
/**
 * --------------------- query check ----------------
 */
function queryKeyCheck(query, rules) {
    var e_3, _a;
    var queryKeys = Reflect.ownKeys(query);
    var errs = [];
    try {
        for (var rules_1 = __values(rules), rules_1_1 = rules_1.next(); !rules_1_1.done; rules_1_1 = rules_1.next()) {
            var rule = rules_1_1.value;
            if (!queryKeys.includes(rule.key)) {
                errs.push(rule.key + " is required; ");
                continue;
            }
            var value = query[rule.key];
            var err = null;
            switch (rule.type) {
                case "string":
                    err = stringHandler([rule.key], value, rule);
                    break;
                case "array":
                    /**
                     *rray item be checked as string
                     */
                    err = arrayHandler([rule.key], value, {
                        type: "array", itemRule: __assign({ type: "string" }, rule.itemRule)
                    });
                    break;
            }
            if (err)
                errs.push(err);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (rules_1_1 && !rules_1_1.done && (_a = rules_1.return)) _a.call(rules_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    if (errs.length === 0)
        return null;
    return errs.join("");
}
/**
 * queryCheck(), precheck middleware for query;
 */
function queryCheck(rules) {
    var _this = this;
    return function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        var queryErrMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queryErrMsg = queryKeyCheck(ctx.query, rules);
                    if (!queryErrMsg) return [3 /*break*/, 1];
                    ctx.status = 400;
                    ctx.body = { queryError: queryErrMsg };
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, next()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
exports.queryCheck = queryCheck;
