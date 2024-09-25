/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/content/content.js":
/*!********************************!*\
  !*** ./src/content/content.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initialize: () => (/* binding */ initialize)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var LOCAL_ENV = false;
var SPONSOR_CIRCLE_ICON = "https://i.imgur.com/Oj6PnUe.png";
var COMMISSION_RATE = 1;

///////////////////////////////////
var collectAndSendBrowserInfoApiUrl = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/collectAndSendBrowserInfo' : 'https://collectandsendbrowserinfo-6n7me4jtka-uc.a.run.app';
var UrlApplyRakutenDeepLink = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/applyRakutenDeepLink' : 'https://us-central1-sponsorcircle-3f648.cloudfunctions.net/applyRakutenDeepLink';

///////////////////////////////////
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "sendData") {
    console.log("Data received in content script:", message.data);
  }
});
function getDataFromStorage() {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get("userSettings", function (data) {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        resolve(data.userSettings);
      }
    });
  });
}

////////////////////////////////////
function fetchDataFromServer(_x) {
  return _fetchDataFromServer.apply(this, arguments);
}
function _fetchDataFromServer() {
  _fetchDataFromServer = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(url) {
    var response, responseData;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return fetch(url);
        case 3:
          response = _context2.sent;
          if (response.ok) {
            _context2.next = 6;
            break;
          }
          throw new Error("HTTP error! Status: ".concat(response.status));
        case 6:
          _context2.next = 8;
          return response.json();
        case 8:
          responseData = _context2.sent;
          return _context2.abrupt("return", responseData);
        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching data:', _context2.t0);
          throw _context2.t0;
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 12]]);
  }));
  return _fetchDataFromServer.apply(this, arguments);
}
function isGoogle(url) {
  // Use a regular expression to match "http(s)://www.google." followed by any characters
  var pattern = /^https?:\/\/www\.google\.\w+/i;
  return pattern.test(url);
}
function ensureHttps(url) {
  // Check if the URL starts with 'http://' or 'https://'
  if (!/^https?:\/\//i.test(url)) {
    // If not, prepend 'https://'
    url = "https://".concat(url);
  }
  return url;
}
function isMainDomain(currentUrl, mainDomain) {
  function extractMainDomain(url) {
    var domain = url.replace(/(https?:\/\/)?(www\.)?/, '');
    domain = domain.split('/')[0];
    var parts = domain.split('.');
    return parts.slice(0, -1).join('.');
  }

  // Extract main parts of the domains from both URLs
  var mainPartCurrent = extractMainDomain(currentUrl);
  var mainPartMain = extractMainDomain(mainDomain);

  // Check if the main parts match
  return mainPartCurrent === mainPartMain;
}

//////////////////////////////////////
function handleApplyCouponCodeOnCheckout(couponCode, isolatedIframe) {
  var discountInput = document.querySelector('input[aria-label="Discount code"]') || document.querySelector('input[placeholder="Discount code"]');

  // Check if the input element exists
  if (discountInput) {
    discountInput.focus();
    discountInput.value = couponCode;

    // Trigger an input event to simulate user input
    var inputEvent = new Event('input', {
      bubbles: true
    });
    discountInput.dispatchEvent(inputEvent);
  } else {
    console.log("CANT FIND INPUT FIELD");
  }
  setTimeout(function () {
    var applyButton = document.querySelector('button[aria-label="Apply Discount Code"]');

    // Check if the button element exists
    if (applyButton) {
      // Simulate a click event on the button
      applyButton.click();
      isolatedIframe.style.display = 'none';
      // maindDiv.style.display = 'none';
    } else {
      console.error('Button with aria-label "Apply Discount Code" not found.');
    }
  }, 300);
}
function postProcess(_x2, _x3) {
  return _postProcess.apply(this, arguments);
}
function _postProcess() {
  _postProcess = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(url, payload) {
    var response, data;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        case 3:
          response = _context3.sent;
          if (response.ok) {
            _context3.next = 6;
            break;
          }
          throw new Error("Error: ".concat(response.status, " - ").concat(response.statusText));
        case 6:
          _context3.next = 8;
          return response.json();
        case 8:
          data = _context3.sent;
          return _context3.abrupt("return", data);
        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error('POST request failed:', _context3.t0);
          return _context3.abrupt("return", null);
        case 16:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 12]]);
  }));
  return _postProcess.apply(this, arguments);
}
function applyRakutenDeepLink(_x4, _x5) {
  return _applyRakutenDeepLink.apply(this, arguments);
}
function _applyRakutenDeepLink() {
  _applyRakutenDeepLink = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(campaign, userSettings) {
    var trackingLink;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return postProcess(UrlApplyRakutenDeepLink, {
            advertiserUrl: campaign.advertiserURL,
            advertiserId: Number(campaign.campaignID),
            teamName: userSettings.selectedCharityObject.organizationName
          });
        case 2:
          trackingLink = _context4.sent;
          return _context4.abrupt("return", trackingLink);
        case 4:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _applyRakutenDeepLink.apply(this, arguments);
}
function getAllowedBrandInfo(campaigns) {
  var currentWebsiteUrl = window.location.hostname;
  var resultCampaign = null;
  var resultSubDomain = null;
  var _loop = function _loop() {
      if (resultCampaign) {
        return {
          v: {
            allowedBrand: resultCampaign,
            allowedSubDomain: resultSubDomain
          }
        };
      }
      var campaign = campaigns[i];
      var fullUrl = ensureHttps(campaign.advertiserURL);
      var urlHostname = new URL(fullUrl).hostname;

      // Check if window hostname matches campain hostname  
      var domainMatched = isMainDomain(currentWebsiteUrl, urlHostname);
      if (domainMatched) {
        return {
          v: {
            allowedBrand: campaign,
            allowedSubDomain: null
          }
        };
      }

      // Otherwiese check if window hostname matches campain's subdomain's hostname  
      var allowedSubDomains = campaign.subDomains;
      allowedSubDomains.forEach(function (allowedSubDomain) {
        var fullUrl = ensureHttps(allowedSubDomain);
        var allowedSubDomainHostname = new URL(fullUrl).hostname;
        var domainMatched = isMainDomain(currentWebsiteUrl, allowedSubDomainHostname);
        if (domainMatched) {
          resultCampaign = campaign;
          resultSubDomain = allowedSubDomain;
        }
      });
    },
    _ret;
  for (var i = 0; i < campaigns.length; i++) {
    _ret = _loop();
    if (_ret) return _ret.v;
  }
  return {
    allowedBrand: null,
    allowedSubDomain: null
  };
}
function isCouponedWebsiteCheckout() {
  // const COUPONED_BRANDS = ["lacoutts.com", "softstrokessilk.com", "lavenderpolo.com"]
  var couponInfo = null;
  var href = window.location.href;
  if (href.includes("https://lacoutts.com/checkouts")) {
    couponInfo = {
      brand: "lacoutts.com",
      couponCode: "LaCouttsSC20",
      amount: "20%"
    };
  } else if (href.includes("https://www.softstrokessilk.com/checkouts")) {
    couponInfo = {
      brand: "softstrokessilk.com",
      couponCode: "LOVESILK",
      amount: "10%"
    };
  }
  return couponInfo;
}
function isCouponedWebsite(domain) {
  var couponInfo = null;
  var href = new URL(domain).href;
  if (href.includes("https://lacoutts.com")) {
    couponInfo = {
      brand: "lacoutts.com",
      couponCode: "LaCouttsSC20",
      amount: "20%"
    };
  } else if (href.includes("https://www.softstrokessilk.com")) {
    couponInfo = {
      brand: "softstrokessilk.com",
      couponCode: "LOVESILK",
      amount: "10%"
    };
  }
  return couponInfo;
}

///////////////////////////// INITIALIZE ////////////////////////////////
function initialize() {
  return _initialize.apply(this, arguments);
}
function _initialize() {
  _initialize = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
    var userSettings, closedDiv, campaigns, isGoogleSearch, _getAllowedBrandInfo, allowedBrand, allowedSubDomain, codeAlreadyAppliedToBrand, couponInfo;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return getDataFromStorage();
        case 2:
          userSettings = _context5.sent;
          closedDiv = createClosedDiv();
          document.body.appendChild(closedDiv);
          _context5.next = 7;
          return fetchCampaigns();
        case 7:
          campaigns = _context5.sent;
          // GOOGLE SEARCH
          isGoogleSearch = window.location.href.includes('https://www.google.com/search') || window.location.href.includes('https://www.google.ca/search');
          if (!isGoogleSearch) {
            _context5.next = 17;
            break;
          }
          if (!(!userSettings || !userSettings.email)) {
            _context5.next = 14;
            break;
          }
          createLoginContainer(closedDiv);
          _context5.next = 16;
          break;
        case 14:
          _context5.next = 16;
          return applyGoogleSearchDiscounts(campaigns, userSettings);
        case 16:
          return _context5.abrupt("return");
        case 17:
          // BRAND PAGES
          _getAllowedBrandInfo = getAllowedBrandInfo(campaigns), allowedBrand = _getAllowedBrandInfo.allowedBrand, allowedSubDomain = _getAllowedBrandInfo.allowedSubDomain;
          if (allowedBrand) {
            _context5.next = 20;
            break;
          }
          return _context5.abrupt("return");
        case 20:
          if (!(!userSettings || !userSettings.email)) {
            _context5.next = 23;
            break;
          }
          createLoginContainer(closedDiv);
          return _context5.abrupt("return");
        case 23:
          codeAlreadyAppliedToBrand = isCodeAlreadyAppliedToWebsite(); // Coupon Container
          couponInfo = isCouponedWebsiteCheckout();
          if (!couponInfo) {
            _context5.next = 30;
            break;
          }
          _context5.next = 28;
          return createApplyCouponCodeContainer(couponInfo, closedDiv, allowedBrand, userSettings);
        case 28:
          _context5.next = 36;
          break;
        case 30:
          if (!codeAlreadyAppliedToBrand) {
            _context5.next = 33;
            break;
          }
          _context5.next = 33;
          return createAppliedLinkPageContainer(allowedBrand, closedDiv, userSettings);
        case 33:
          if (!(!couponInfo && !allowedSubDomain && !codeAlreadyAppliedToBrand)) {
            _context5.next = 36;
            break;
          }
          _context5.next = 36;
          return createActivatePageContainer(allowedBrand, closedDiv, userSettings);
        case 36:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _initialize.apply(this, arguments);
}
function isCodeAlreadyAppliedToWebsite() {
  var codeAlreadyAppliedToBrand;
  var href = window.location.href;
  var codeInUrl = href.includes("irclickid") || href.includes("clickid") || href.includes("ranMID") || href.includes("sc-coupon=activated");
  var validIrclickid = getCookie("sc-irclickid");
  var validClickid = getCookie("sc-clickid");
  var validScCoupon = getCookie("sc-coupon");
  var validranMID = getCookie("sc-ranMID");
  var isValidCookie = validIrclickid || validClickid || validScCoupon || validranMID;
  codeAlreadyAppliedToBrand = codeInUrl || isValidCookie;
  if (codeInUrl && !isValidCookie) {
    saveClickIdToCookie();
  }
  return codeAlreadyAppliedToBrand;
}
function applyAffiliateLink(_x6, _x7) {
  return _applyAffiliateLink.apply(this, arguments);
}
function _applyAffiliateLink() {
  _applyAffiliateLink = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(campaignID, userSettings) {
    var selectedCharityObject, email, url, response, responseData;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          selectedCharityObject = userSettings.selectedCharityObject, email = userSettings.email;
          if (selectedCharityObject !== null && selectedCharityObject !== void 0 && selectedCharityObject.organizationName) {
            _context6.next = 3;
            break;
          }
          throw new Error('No Charity Selected');
        case 3:
          // NOTE: CampaignID is same as ProgramId;
          url = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/applyTrackingLink?programId=".concat(campaignID, "&teamName=").concat(selectedCharityObject.organizationName, "&email=").concat(email) : "https://applytrackinglink-6n7me4jtka-uc.a.run.app?programId=".concat(campaignID, "&teamName=").concat(selectedCharityObject.organizationName, "&email=").concat(email);
          _context6.prev = 4;
          _context6.next = 7;
          return fetch(url);
        case 7:
          response = _context6.sent;
          if (response.ok) {
            _context6.next = 10;
            break;
          }
          throw new Error("HTTP error! Status: ".concat(response.status));
        case 10:
          _context6.next = 12;
          return response.json();
        case 12:
          responseData = _context6.sent;
          return _context6.abrupt("return", responseData);
        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](4);
          console.error('Error fetching data:', _context6.t0);
          throw _context6.t0;
        case 20:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[4, 16]]);
  }));
  return _applyAffiliateLink.apply(this, arguments);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyImpactLink);
}
function fetchCampaigns() {
  return _fetchCampaigns.apply(this, arguments);
}
function _fetchCampaigns() {
  _fetchCampaigns = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
    var url;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          url = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getSyncedCampaigns" : "https://us-central1-sponsorcircle-3f648.cloudfunctions.net/getSyncedCampaigns";
          _context7.next = 3;
          return fetchDataFromServer(url);
        case 3:
          return _context7.abrupt("return", _context7.sent);
        case 4:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _fetchCampaigns.apply(this, arguments);
}
function extractUrlFromCite(divElement) {
  var citeElements = divElement.querySelectorAll('cite');
  var urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  var _iterator = _createForOfIteratorHelper(citeElements),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var cite = _step.value;
      var textContent = cite.textContent.trim();
      if (urlPattern.test(textContent)) {
        return textContent;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return null;
}
function applyGoogleSearchDiscounts(_x8, _x9) {
  return _applyGoogleSearchDiscounts.apply(this, arguments);
} ///////////////////////////// NEW DESIGN //////////////////////////////////
function _applyGoogleSearchDiscounts() {
  _applyGoogleSearchDiscounts = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(campaigns, userSettings) {
    var searchResults;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return applyBoostedAd();
        case 2:
          searchResults = document.querySelectorAll('div.g');
          searchResults.forEach(function (result) {
            var _result$querySelector;
            var href = (_result$querySelector = result.querySelector('a[href^="http"]')) === null || _result$querySelector === void 0 ? void 0 : _result$querySelector.href;
            var url = href || extractUrlFromCite(result);
            if (!url) return;
            var domain = new URL(url).hostname;
            campaigns.map(function (campaign) {
              var fullUrl = ensureHttps(campaign.advertiserURL);
              var allowedDomain = new URL(fullUrl).hostname;
              var percentage = campaign.defaultPayoutRate * COMMISSION_RATE + "%";

              // If the Url isnt in allowed domain skip html injection
              if (!isMainDomain(domain, allowedDomain)) return;

              // Check to see if main domain not included in subdomains to prevent mutiple re-renders
              // campaign.subDomains.forEach((subdomain) => {
              //   const fullUrl = ensureHttps(subdomain);
              //   const allowedSubdomainDomain = new URL(fullUrl).hostname;

              //   if (isMainDomain(domain, allowedSubdomainDomain)) return;
              // })

              var mainDiv = document.createElement('div');
              mainDiv.style.color = '#1a0dab';
              mainDiv.style.background = '#eeeeee';
              mainDiv.style.fontSize = '14px';
              mainDiv.style.lineHeight = '27px';
              mainDiv.style.height = '37px';
              mainDiv.style.margin = '0 0 7px 0';
              mainDiv.style.padding = '6px 0 0 8px';
              mainDiv.style.boxSizing = 'border-box';
              mainDiv.style.width = '100%';
              mainDiv.style.borderRadius = '5px';
              mainDiv.style.fontFamily = "'Cerebri Sans', sans-serif";
              mainDiv.style.minWidth = '542px';
              mainDiv.style.cursor = 'pointer';
              var logoDiv = document.createElement('div');
              logoDiv.style.width = '33px';
              logoDiv.style.height = '25px';
              logoDiv.style["float"] = 'left';
              logoDiv.style.background = "url(https://i.imgur.com/GDbtHnR.png) no-repeat";
              logoDiv.style.backgroundSize = 'contain';
              var textDiv = document.createElement('a');
              textDiv.style.whiteSpace = 'nowrap';
              textDiv.textContent = "Give ".concat(percentage, " to your cause \uD83D\uDC9C");
              textDiv.target = "_blank";
              textDiv.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
                var redirectionLink, _redirectionLink2;
                return _regeneratorRuntime().wrap(function _callee8$(_context8) {
                  while (1) switch (_context8.prev = _context8.next) {
                    case 0:
                      if (!(campaign.provider === "Impact")) {
                        _context8.next = 5;
                        break;
                      }
                      _context8.next = 3;
                      return applyAffiliateLink(campaign.campaignID, userSettings);
                    case 3:
                      redirectionLink = _context8.sent;
                      window.location.href = "http://" + redirectionLink;
                    case 5:
                      if (!(campaign.provider === "Rakuten")) {
                        _context8.next = 10;
                        break;
                      }
                      _context8.next = 8;
                      return applyRakutenDeepLink(campaign, userSettings);
                    case 8:
                      _redirectionLink2 = _context8.sent;
                      window.location.href = _redirectionLink2;
                    case 10:
                    case "end":
                      return _context8.stop();
                  }
                }, _callee8);
              }));
              mainDiv.appendChild(logoDiv);
              mainDiv.appendChild(textDiv);
              result.insertBefore(mainDiv, result.firstChild);
              return;
            });
          });
        case 4:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return _applyGoogleSearchDiscounts.apply(this, arguments);
}
function createIsolatedIframe(width, height) {
  var iframe = document.createElement('iframe');
  iframe.setAttribute('src', 'about:blank'); // Load a blank page initially

  // Set initial inline styles for the iframe
  iframe.style.position = 'fixed';
  iframe.style.top = '-100%'; // Start from above the viewport
  iframe.style.left = '85%';
  iframe.style.transform = 'translate(-50%, -50%)';
  iframe.style.width = width;
  iframe.style.height = height;
  iframe.style.border = 'none';
  iframe.style.backgroundColor = '#FDFDFD';
  iframe.style.borderRadius = '16px';
  iframe.style.boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)';
  iframe.style.display = 'flex';
  iframe.style.zIndex = 20000;
  iframe.style.transition = 'top 0.75s ease-out'; // Animation for moving down

  // Access the document within the iframe
  var iframeDocument = iframe.contentDocument;

  // If the iframe document is not null
  if (iframeDocument) {
    // Apply some default styles to the iframe content to ensure isolation
    iframeDocument.body.style.margin = '0';
    iframeDocument.body.style.padding = '20px';
    iframeDocument.body.style.fontFamily = 'Arial, sans-serif';
    iframeDocument.body.style.fontSize = '16px';
    iframeDocument.body.style.color = '#333';
  }

  // Trigger the animation after appending
  setTimeout(function () {
    iframe.style.top = '35%'; // Move down to the final position

    var link = iframe.contentDocument.createElement('link');
    link.href = 'https://fonts.cdnfonts.com/css/montserrat';
    link.rel = 'stylesheet';
    iframe.contentDocument.head.appendChild(link);
  }, 0);

  // Return the created iframe
  return iframe;
}
function createClosedDiv() {
  var img = document.createElement('img');

  // Set the src attribute
  img.src = 'https://i.imgur.com/Oj6PnUe.png';

  // Apply the styles
  img.style.position = 'fixed';
  img.style.bottom = '0%';
  img.style.left = '3%';
  img.style.transform = 'translate(-50%, -50%)';
  img.style.width = '50px';
  img.style.height = '50px';
  img.style.border = 'none';
  img.style.backgroundColor = 'rgb(253, 253, 253)';
  img.style.borderRadius = '16px';
  img.style.boxShadow = 'rgba(0, 0, 0, 0.25) 0px 4px 4px 0px';
  img.style.display = 'flex';
  img.style.zIndex = '10000';
  img.style.transition = 'top 0.75s ease-out 0s';
  img.style.cursor = 'pointer';
  img.style.display = 'none';

  // Return the img
  return img;
}
function createActivatePageContainer(_x10, _x11, _x12) {
  return _createActivatePageContainer.apply(this, arguments);
}
function _createActivatePageContainer() {
  _createActivatePageContainer = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(allowedBrand, closedDiv, userSettings) {
    var isolatedIframe;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          isolatedIframe = createIsolatedIframe('400px', '100px');
          isolatedIframe.onload = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
            var selectedCharityObject, leftDiv, rightDiv, iframeDocument;
            return _regeneratorRuntime().wrap(function _callee10$(_context10) {
              while (1) switch (_context10.prev = _context10.next) {
                case 0:
                  selectedCharityObject = userSettings.selectedCharityObject;
                  leftDiv = createLeftDiv(selectedCharityObject);
                  rightDiv = createRightDiv(isolatedIframe, allowedBrand, undefined, closedDiv, userSettings);
                  iframeDocument = isolatedIframe.contentDocument || isolatedIframe.contentWindow.document;
                  iframeDocument.body.innerHTML = '';
                  iframeDocument.body.style.display = 'flex';
                  iframeDocument.body.style.margin = '0px';
                  iframeDocument.body.appendChild(leftDiv);
                  iframeDocument.body.appendChild(rightDiv);
                case 9:
                case "end":
                  return _context10.stop();
              }
            }, _callee10);
          }));
          document.body.appendChild(isolatedIframe);
        case 3:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return _createActivatePageContainer.apply(this, arguments);
}
function createLeftDiv(selectedCharityObject) {
  var div = document.createElement("div");
  div.style.width = "35%";
  div.style.height = "100%";
  div.style.display = "flex"; // Use flexbox
  div.style.alignItems = "center"; // Center the content vertically
  div.style.justifyContent = "center"; // Center the content horizontally
  div.style.flexDirection = "column";
  div.style.background = "#2C0593";

  // Create a div to wrap the first two images
  var imagesWrapper = document.createElement("div");
  imagesWrapper.style.display = "flex"; // Use flexbox
  imagesWrapper.style.flexDirection = "row"; // Arrange images horizontally
  imagesWrapper.style.alignItems = "center"; // Center the images vertically

  // Create the first image
  var image1 = document.createElement("img");
  image1.src = SPONSOR_CIRCLE_ICON;
  image1.style.borderRadius = "8px";
  image1.style.width = "47px";

  // Create the second image
  var image2Wrapper = document.createElement("div");
  image2Wrapper.style.width = "50px";
  image2Wrapper.style.borderRadius = "8px";
  image2Wrapper.style.height = "100%";
  image2Wrapper.style.background = "white";
  image2Wrapper.style.display = "flex";
  image2Wrapper.style.marginLeft = "5px";
  var image2 = document.createElement("img");
  image2.src = selectedCharityObject.logo;
  image2.style.borderRadius = "8px";
  image2.style.width = "37px";
  image2.style.margin = "auto";
  image2Wrapper.appendChild(image2);

  // Append the first two images to the images wrapper div
  imagesWrapper.appendChild(image1);
  imagesWrapper.appendChild(image2Wrapper);

  // Create the third image
  var image3 = document.createElement("img");
  image3.src = "https://i.imgur.com/xobrrSH.png"; // Replace with actual image URL
  image3.style.width = "90%";
  image3.style.paddingTop = "7px";

  // Append the images wrapper and the third image to the left div
  div.appendChild(imagesWrapper);
  div.appendChild(image3);
  return div;
}
function createRightDiv(isolatedIframe, allowedBrand, couponInfo, closedDiv, userSettings) {
  var discountAmount = couponInfo ? couponInfo === null || couponInfo === void 0 ? void 0 : couponInfo.amount : allowedBrand.defaultPayoutRate * COMMISSION_RATE + "%";
  closedDiv.onclick = function () {
    isolatedIframe.style.display = '';
    closedDiv.style.display = 'none';
    setCookie("sc-minimize", false);
  };
  var div = document.createElement("div");
  div.style.width = "65%";
  div.style.height = "100%";
  div.style.display = "flex";

  // Create and append close button
  var closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '5px';
  closeButton.style.right = '3px';
  closeButton.style.backgroundColor = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '15px';
  closeButton.style.color = '#333';
  closeButton.onclick = function () {
    setCookie("sc-minimize", true);
    isolatedIframe.style.display = 'none';
    closedDiv.style.display = '';
  };
  div.appendChild(closeButton);
  var button = document.createElement("button");
  button.style.borderRadius = "21px";
  button.style.border = "none";
  button.style.boxShadow = "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px";
  button.style.height = "40px";
  button.style.width = "85%";
  button.style.margin = "auto";
  button.style.cursor = "pointer";
  button.textContent = "Activate to Give ".concat(discountAmount);

  // Change background color on hover
  button.addEventListener("mouseenter", function () {
    button.style.background = "rgba(44, 5, 147, 0.21)";
  });

  // Restore default background color when not hovered
  button.addEventListener("mouseleave", function () {
    button.style.background = "#FFF";
  });
  button.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var redirectionLink, _redirectionLink;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Disable the button and show loading text
          button.disabled = true;
          button.style.cursor = "not-allowed";
          button.textContent = "Loading...";
          if (!(allowedBrand && allowedBrand.discountType === "Coupon")) {
            _context.next = 13;
            break;
          }
          if (!isCouponedWebsiteCheckout()) {
            _context.next = 10;
            break;
          }
          _context.next = 8;
          return handleApplyCouponCodeOnCheckout(couponInfo === null || couponInfo === void 0 ? void 0 : couponInfo.couponCode, isolatedIframe);
        case 8:
          _context.next = 11;
          break;
        case 10:
          window.location.href = allowedBrand.trackingLink;
        case 11:
          _context.next = 23;
          break;
        case 13:
          if (!(allowedBrand.provider === "Impact")) {
            _context.next = 18;
            break;
          }
          _context.next = 16;
          return applyAffiliateLink(allowedBrand.campaignID, userSettings);
        case 16:
          redirectionLink = _context.sent;
          window.location.href = "http://" + redirectionLink;
        case 18:
          if (!(allowedBrand.provider === "Rakuten")) {
            _context.next = 23;
            break;
          }
          _context.next = 21;
          return applyRakutenDeepLink(allowedBrand, userSettings);
        case 21:
          _redirectionLink = _context.sent;
          window.location.href = _redirectionLink;
        case 23:
          setCookie("sc-minimize", false);
          _context.next = 29;
          break;
        case 26:
          _context.prev = 26;
          _context.t0 = _context["catch"](0);
          console.error("Error activating to give:", _context.t0);
        case 29:
          _context.prev = 29;
          // Re-enable the button and restore the original text
          button.disabled = false;
          button.style.cursor = "pointer";
          button.textContent = "Activate to Give ".concat(discountAmount);
          return _context.finish(29);
        case 34:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 26, 29, 34]]);
  }));
  div.appendChild(button);
  var notIncludedDeals = createGiftCardNotice();
  div.appendChild(notIncludedDeals);
  return div;
}
function createGiftCardNotice() {
  var span = document.createElement('span');
  span.style.position = 'fixed';
  span.style.fontSize = 'x-small';
  span.style.bottom = '5px';
  span.style.right = '15px';
  span.textContent = 'Gift cards not included';
  return span;
}
function hasMultipleTerms(arr) {
  var count = 0;
  var _iterator2 = _createForOfIteratorHelper(arr),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var item = _step2.value;
      if (item.details) {
        count++;
      }
      if (count > 1) {
        return true;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return false;
}
function createAppliedLinkPageContainer(_x13, _x14, _x15) {
  return _createAppliedLinkPageContainer.apply(this, arguments);
}
function _createAppliedLinkPageContainer() {
  _createAppliedLinkPageContainer = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(allowedBrand, closedDiv, userSettings) {
    var selectedCharityObject, frameHeight, isolatedIframe, isMinimized;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          selectedCharityObject = userSettings.selectedCharityObject;
          frameHeight = hasMultipleTerms(allowedBrand.terms) ? '370px' : '355px';
          isolatedIframe = createIsolatedIframe('400px', frameHeight);
          isolatedIframe.onload = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
            var navbar, middleSection, iframeDocument, termsAndService;
            return _regeneratorRuntime().wrap(function _callee12$(_context12) {
              while (1) switch (_context12.prev = _context12.next) {
                case 0:
                  navbar = createNavbar(isolatedIframe, closedDiv);
                  middleSection = createMiddleSection(allowedBrand, selectedCharityObject);
                  iframeDocument = isolatedIframe.contentDocument || isolatedIframe.contentWindow.document;
                  iframeDocument.body.innerHTML = '';
                  iframeDocument.body.style.display = 'flex';
                  iframeDocument.body.style.flexDirection = 'column';
                  iframeDocument.body.style.margin = '0px';
                  iframeDocument.body.style.fontFamily = "Montserrat";
                  iframeDocument.body.appendChild(navbar);
                  iframeDocument.body.appendChild(middleSection);
                  termsAndService = createTermsAndServiceDiv(allowedBrand);
                  iframeDocument.body.appendChild(termsAndService);
                case 12:
                case "end":
                  return _context12.stop();
              }
            }, _callee12);
          }));
          document.body.appendChild(isolatedIframe);
          isMinimized = getCookie("sc-minimize");
          if (isMinimized === "true") {
            closedDiv.style.display = 'flex';
            isolatedIframe.style.display = 'none';
          }
        case 7:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  }));
  return _createAppliedLinkPageContainer.apply(this, arguments);
}
function createTermsAndServiceDiv(allowedBrand) {
  // Create the fieldset
  var fieldset = document.createElement('fieldset');
  fieldset.style.margin = '5px'; // Set margin for the fieldset
  fieldset.style.border = 'none'; // Remove the default border

  // Create the legend with centered text
  var legend = document.createElement('legend');
  legend.textContent = 'Offer Terms and Service';
  legend.style.textAlign = 'center'; // Center the legend text
  legend.style.fontSize = '14px'; // Set font size for the legend
  legend.style.padding = '0 10px'; // Add padding for spacing
  legend.style.margin = '0'; // Remove default margin
  legend.style.position = 'relative'; // Allow positioning adjustments

  // Create a pseudo-element for the lines
  var lineBefore = document.createElement('span');
  lineBefore.textContent = '';
  lineBefore.style.borderBottom = '1px solid black'; // Line on the left
  lineBefore.style.flexGrow = '1'; // Allow the line to grow
  lineBefore.style.marginRight = '10px'; // Space between line and text

  var lineAfter = document.createElement('span');
  lineAfter.textContent = '';
  lineAfter.style.borderBottom = '1px solid black'; // Line on the right
  lineAfter.style.flexGrow = '1'; // Allow the line to grow
  lineAfter.style.marginLeft = '10px'; // Space between line and text

  // Create a container for the lines and the legend text
  var legendContainer = document.createElement('div');
  legendContainer.style.display = 'flex'; // Use flexbox to align items
  legendContainer.style.alignItems = 'center'; // Center vertically
  legendContainer.appendChild(lineBefore);
  legendContainer.appendChild(legend);
  legendContainer.appendChild(lineAfter);

  // Append the legendContainer to the fieldset
  fieldset.appendChild(legendContainer);

  // Create the terms as paragraph elements
  var termsWrapper = document.createElement('div');
  termsWrapper.style.marginTop = '8px';
  allowedBrand.terms.forEach(function (term) {
    var p = document.createElement('p');
    p.style.fontSize = '12px'; // Set font size for the terms
    p.style.marginBottom = '5px'; // Remove default margin for paragraphs

    // Check if details exist and create the appropriate content
    if (term.details) {
      p.innerHTML = "<b>".concat(term.title, ":</b> ").concat(term.details);
    }
    termsWrapper.appendChild(p);
  });
  fieldset.appendChild(termsWrapper);
  return fieldset;
}
function createNavbar(isolatedIframe, closedDiv) {
  closedDiv.onclick = function () {
    isolatedIframe.style.display = '';
    closedDiv.style.display = 'none';
    setCookie("sc-minimize", false);
  };
  var div = document.createElement("div");
  div.style.flexDirection = "row";
  div.style.background = "rgb(44, 5, 147)";
  div.style.padding = "10px";
  div.style.alignItems = "center";
  div.style.display = "flex";
  var img1 = document.createElement("img");
  img1.src = "https://i.imgur.com/zbRF4VT.png";
  img1.style.borderRadius = "8px";
  img1.style.width = "20px";
  img1.style.marginRight = "10px";
  var img2 = document.createElement("img");
  img2.src = "https://i.imgur.com/xobrrSH.png";
  img2.style.width = "150px";
  var closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '5px';
  closeButton.style.right = '3px';
  closeButton.style.backgroundColor = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '15px';
  closeButton.style.color = 'white';
  closeButton.onclick = function () {
    isolatedIframe.style.display = 'none';
    setCookie("sc-minimize", true);
    closedDiv.style.display = '';
  };
  div.appendChild(closeButton);
  div.appendChild(img1);
  div.appendChild(img2);
  return div;
}
function createMiddleSection(allowedBrand, selectedCharityObject) {
  var div = document.createElement("div");
  div.style.display = "flex";
  div.style.flexDirection = "column";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  var img = document.createElement("img");
  img.src = selectedCharityObject.logo;
  img.style.width = "51.324px";
  img.style.height = "49px";
  img.style.margin = "20px";
  img.style.padding = "10px";
  img.style.borderRadius = "10px";
  img.style.boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)';
  var h1 = document.createElement("h1");
  h1.textContent = "Offer Activated!";
  h1.style.marginTop = "0px";
  h1.style.fontFamily = "Montserrat";
  h1.style.fontSize = "18px";
  h1.style.fontStyle = "normal";
  h1.style.fontWeight = "600";
  var p = document.createElement("p");
  p.textContent = "Your purchases will now give up to ".concat(allowedBrand.defaultPayoutRate * COMMISSION_RATE, "% to \n") + selectedCharityObject.organizationName;
  p.style.textAlign = "center";
  p.style.margin = "0px";
  p.style.fontFamily = "Montserrat";
  p.style.fontSize = "14px";
  p.style.fontStyle = "normal";
  p.style.fontWeight = "400";
  p.style.lineHeight = "normal";
  p.style.padding = "0px 20px";
  div.appendChild(img);
  div.appendChild(h1);
  div.appendChild(p);
  return div;
}
function createLoginMiddleSection() {
  var div = document.createElement("div");
  div.style.display = "flex";
  div.style.flexDirection = "column";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  var img = document.createElement("img");
  img.src = SPONSOR_CIRCLE_ICON;
  img.style.width = "51.324px";
  img.style.height = "49px";
  img.style.margin = "20px";
  img.style.padding = "10px";
  img.style.borderRadius = "10px";
  img.style.boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)';
  var h1 = document.createElement("h1");
  h1.textContent = "Welcome! You’re almost there";
  h1.style.margin = "0px";
  h1.style.fontFamily = "Montserrat";
  h1.style.fontSize = "18px";
  h1.style.fontStyle = "normal";
  h1.style.fontWeight = "600";
  var p = document.createElement("p");
  p.textContent = "Click the \u201CGet Started\u201D button, register, and select your favourite charity. Then, begin shopping!";
  p.style.textAlign = "center";
  p.style.marginBottom = "15px";
  p.style.fontFamily = "Montserrat";
  p.style.fontSize = "14px";
  p.style.fontStyle = "normal";
  p.style.fontWeight = "400";
  p.style.lineHeight = "normal";
  p.style.padding = "0px 20px";
  var button = document.createElement("a");
  button.style.borderRadius = "21px";
  button.style.border = "1px solid rgb(0, 0, 0)";
  button.style.height = "40px";
  button.style.width = "50%";
  button.style.margin = "auto";
  button.style.cursor = "pointer";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.textDecoration = "solid";
  button.textContent = "Get Started";
  button.target = "_blank";
  button.href = LOCAL_ENV ? "https://localhost:3000/onboard?extensionId=".concat(chrome.runtime.id) : "https://sc-affiliate.vercel.app/onboard?extensionId=".concat(chrome.runtime.id);
  div.appendChild(img);
  div.appendChild(h1);
  div.appendChild(p);
  div.appendChild(button);
  return div;
}

///////////////////// COUPON CODE ////////////////////////////
function createLoginContainer(_x16) {
  return _createLoginContainer.apply(this, arguments);
}
function _createLoginContainer() {
  _createLoginContainer = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15(closedDiv) {
    var isolatedIframe, isMinimized;
    return _regeneratorRuntime().wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          isolatedIframe = createIsolatedIframe('400px', '330px');
          isolatedIframe.onload = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14() {
            var navbar, middleSection, iframeDocument;
            return _regeneratorRuntime().wrap(function _callee14$(_context14) {
              while (1) switch (_context14.prev = _context14.next) {
                case 0:
                  navbar = createNavbar(isolatedIframe, closedDiv);
                  middleSection = createLoginMiddleSection();
                  iframeDocument = isolatedIframe.contentDocument || isolatedIframe.contentWindow.document;
                  iframeDocument.body.innerHTML = '';
                  iframeDocument.body.style.display = 'flex';
                  iframeDocument.body.style.flexDirection = 'column';
                  iframeDocument.body.style.margin = '0px';
                  iframeDocument.body.style.fontFamily = "Montserrat";
                  iframeDocument.body.appendChild(navbar);
                  iframeDocument.body.appendChild(middleSection);
                case 10:
                case "end":
                  return _context14.stop();
              }
            }, _callee14);
          }));
          document.body.appendChild(isolatedIframe);
          isMinimized = getCookie("sc-minimize");
          if (isMinimized === "true") {
            closedDiv.style.display = 'flex';
            isolatedIframe.style.display = 'none';
          }
        case 5:
        case "end":
          return _context15.stop();
      }
    }, _callee15);
  }));
  return _createLoginContainer.apply(this, arguments);
}
function createApplyCouponCodeContainer(_x17, _x18, _x19, _x20) {
  return _createApplyCouponCodeContainer.apply(this, arguments);
} /////////// COOKIES /////////////
function _createApplyCouponCodeContainer() {
  _createApplyCouponCodeContainer = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee17(couponInfo, closedDiv, allowedBrand, userSettings) {
    var selectedCharityObject, isolatedIframe;
    return _regeneratorRuntime().wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          selectedCharityObject = userSettings.selectedCharityObject;
          isolatedIframe = createIsolatedIframe('400px', '100px');
          isolatedIframe.onload = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee16() {
            var leftDiv, rightDiv, iframeDocument;
            return _regeneratorRuntime().wrap(function _callee16$(_context16) {
              while (1) switch (_context16.prev = _context16.next) {
                case 0:
                  leftDiv = createLeftDiv(selectedCharityObject);
                  rightDiv = createRightDiv(isolatedIframe, allowedBrand, couponInfo, closedDiv, userSettings);
                  iframeDocument = isolatedIframe.contentDocument || isolatedIframe.contentWindow.document;
                  iframeDocument.body.innerHTML = '';
                  iframeDocument.body.style.display = 'flex';
                  iframeDocument.body.style.margin = '0px';
                  iframeDocument.body.appendChild(leftDiv);
                  iframeDocument.body.appendChild(rightDiv);
                case 8:
                case "end":
                  return _context16.stop();
              }
            }, _callee16);
          }));
          document.body.appendChild(isolatedIframe);
        case 4:
        case "end":
          return _context17.stop();
      }
    }, _callee17);
  }));
  return _createApplyCouponCodeContainer.apply(this, arguments);
}
function setCookie(name, value, days) {
  var date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  var expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
function getQueryParameter(name) {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}
function saveClickIdToCookie() {
  var irclickid = getQueryParameter("irclickid");
  var ranMID = getQueryParameter("ranMID");
  var clickid = getQueryParameter("clickid");
  var scCoupon = getQueryParameter("sc-coupon");
  if (irclickid) {
    setCookie("sc-irclickid", irclickid, 7);
  }
  if (ranMID) {
    setCookie("sc-ranMID", irclickid, 7);
  }
  if (clickid) {
    setCookie("sc-clickid", clickid, 7);
  }
  if (scCoupon && scCoupon === "activated") {
    setCookie("sc-coupon", scCoupon, 7);
  }
}

//////////// Boosted Ads ///////////////////
function isSearchQueryBarrie() {
  // Check if the URL contains a query parameter with the search term "Barrie"
  var queryParam = new URLSearchParams(window.location.search);
  var query = queryParam.get('q');
  return query && query.toLowerCase().includes('barrie');
}
function boostedAdContainer() {
  // Create the outer container
  var container = document.createElement('div');
  container.className = 'boosted-ad-container';

  // Create the inner content container
  var inner = document.createElement('div');
  inner.className = 'boosted-ad-inner';

  // Create the header section
  var header = document.createElement('div');
  header.className = 'boosted-ad-header';

  // Create the logo container
  var logo = document.createElement('div');
  logo.className = 'boosted-ad-logo';

  // Create and append the logo image
  var logoImg = document.createElement('img');
  logoImg.className = 'boosted-ad-logo-img';
  logoImg.src = 'https://i.imgur.com/JGT9FfJ.png';
  logoImg.alt = 'Busby Centre';
  logo.appendChild(logoImg);

  // Create and append the title
  var title = document.createElement('p');
  title.className = 'boosted-ad-title';
  title.textContent = 'The Busby Centre';
  header.appendChild(logo);
  header.appendChild(title);

  // Create and append the link
  var link = document.createElement('a');
  link.className = 'boosted-ad-link';
  link.target = '_blank';
  link.href = 'https://www.busbycentre.ca';
  link.textContent = 'The Busby Centre | Support Busby Centre today 💜';

  // Create and append the new section
  var additionalSection = document.createElement('div');
  additionalSection.className = 'boosted-ad-additional';

  // Create and append the description paragraph
  var description = document.createElement('p');
  description.className = 'boosted-ad-description';
  description.textContent = 'This advertisement is created by';
  additionalSection.appendChild(description);

  // Create and append the sponsor logo
  var sponsorLogoContainer = document.createElement('div');
  sponsorLogoContainer.className = 'boosted-ad-sponsor-logo';
  var sponsorLogoImg = document.createElement('img');
  sponsorLogoImg.className = 'boosted-ad-sponsor-logo-img';
  sponsorLogoImg.src = 'https://sponsorcircle.com/wp-content/uploads/2021/02/sponsor-circle-black-transparent-1.png';
  sponsorLogoContainer.appendChild(sponsorLogoImg);
  additionalSection.appendChild(sponsorLogoContainer);

  // Append all sections to the inner container
  inner.appendChild(header);
  inner.appendChild(link);

  // Append the inner container to the outer container
  container.appendChild(inner);
  container.appendChild(additionalSection);
  return container;
}
function applyBoostedAd() {
  return _applyBoostedAd.apply(this, arguments);
} /////////////////////////////////// ///////////////////////////////////////
function _applyBoostedAd() {
  _applyBoostedAd = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee18() {
    var showContainer, adContainer, centerColContainer;
    return _regeneratorRuntime().wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          showContainer = isSearchQueryBarrie();
          if (showContainer) {
            _context18.next = 3;
            break;
          }
          return _context18.abrupt("return");
        case 3:
          adContainer = boostedAdContainer(); // Find the rcnt container
          centerColContainer = document.getElementById('center_col');
          if (!centerColContainer) {
            _context18.next = 9;
            break;
          }
          centerColContainer.insertAdjacentElement('afterbegin', adContainer);
          _context18.next = 9;
          return collectAndSendBrowserInfo();
        case 9:
        case "end":
          return _context18.stop();
      }
    }, _callee18);
  }));
  return _applyBoostedAd.apply(this, arguments);
}
function collectAndSendBrowserInfo(_x21) {
  return _collectAndSendBrowserInfo.apply(this, arguments);
}
function _collectAndSendBrowserInfo() {
  _collectAndSendBrowserInfo = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee19(apiEndpoint) {
    var browserInfo, response;
    return _regeneratorRuntime().wrap(function _callee19$(_context19) {
      while (1) switch (_context19.prev = _context19.next) {
        case 0:
          // Collect browser information
          browserInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            appVersion: navigator.appVersion,
            extensionVersion: chrome.runtime.getManifest().version
          };
          _context19.prev = 1;
          _context19.next = 4;
          return fetch(collectAndSendBrowserInfoApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(browserInfo)
          });
        case 4:
          response = _context19.sent;
          if (response.ok) {
            console.log('Browser info sent successfully');
          } else {
            console.error('Failed to send browser info', response.status);
          }
          _context19.next = 11;
          break;
        case 8:
          _context19.prev = 8;
          _context19.t0 = _context19["catch"](1);
          console.error('Error sending browser info:', _context19.t0);
        case 11:
        case "end":
          return _context19.stop();
      }
    }, _callee19, null, [[1, 8]]);
  }));
  return _collectAndSendBrowserInfo.apply(this, arguments);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./src/content/index.ts ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _content__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./content */ "./src/content/content.js");
// @ts-ignore

(0,_content__WEBPACK_IMPORTED_MODULE_0__.initialize)().then(function () {
  console.log('Shop for Good!');
});
/******/ })()
;
//# sourceMappingURL=content.js.map