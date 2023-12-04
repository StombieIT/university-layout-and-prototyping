/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/arrow.js":
/*!*********************************!*\
  !*** ./src/components/arrow.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createArrow: () => (/* binding */ createArrow)\n/* harmony export */ });\nconst createArrow = () => {\n  const arrow = document.createElement('img');\n  arrow.id = 'arrow';\n  arrow.src = './arrow.png';\n  arrow.alt = 'arrow';\n  return arrow;\n};\n\n//# sourceURL=webpack://university-layout-and-prototyping/./src/components/arrow.js?");

/***/ }),

/***/ "./src/components/tnt.js":
/*!*******************************!*\
  !*** ./src/components/tnt.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createTnt: () => (/* binding */ createTnt)\n/* harmony export */ });\nconst createTnt = ({\n  isActive = false\n}) => {\n  const tnt = document.createElement('img');\n  tnt.id = 'tnt';\n  tnt.src = './tnt.webp';\n  tnt.alt = 'tnt';\n  if (isActive) {\n    tnt.classList.add('__active');\n  }\n  return tnt;\n};\n\n//# sourceURL=webpack://university-layout-and-prototyping/./src/components/tnt.js?");

/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ARROW_ID: () => (/* binding */ ARROW_ID),\n/* harmony export */   ApplicationStage: () => (/* binding */ ApplicationStage),\n/* harmony export */   CONTAINER_ID: () => (/* binding */ CONTAINER_ID),\n/* harmony export */   USER_OWNER_ID: () => (/* binding */ USER_OWNER_ID)\n/* harmony export */ });\nconst USER_OWNER_ID = 'user';\nconst ARROW_ID = 'arrow';\nconst CONTAINER_ID = 'container';\nconst ApplicationStage = {\n  AUTHORIZATION: 'AUTHORIZATION',\n  MENU: 'MENU',\n  FIRST_LEVEL: 'FIRST_LEVEL',\n  SECOND_LEVEL: 'SECOND_LEVEL',\n  THIRD_LEVEL: 'THIRD_LEVEL'\n};\n\n//# sourceURL=webpack://university-layout-and-prototyping/./src/constants.js?");

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.scss */ \"./src/index.scss\");\n/* harmony import */ var _utils_time__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/utils/time */ \"./src/utils/time.js\");\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/store */ \"./src/store/index.js\");\n/* harmony import */ var _userBlockOwner__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./userBlockOwner */ \"./src/userBlockOwner.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/models */ \"./src/models.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/constants */ \"./src/constants.js\");\n/* harmony import */ var _components_tnt__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/components/tnt */ \"./src/components/tnt.js\");\n\n\n\n\n\n\n\nconst user = document.getElementById('user');\nconst field = document.getElementById('field');\nconst barrier = document.getElementById('barrier');\nconst arrow = document.getElementById('arrow');\nconst fieldRect = field.getBoundingClientRect();\nconst barrierRect = barrier.getBoundingClientRect();\n\n// ### STATE ###\nlet angle = 0;\nlet userPosition = 0;\nfunction onMouseMove(evt) {\n  const userRect = user.getBoundingClientRect();\n  const centerCoor = {\n    x: userRect.left + userRect.width / 2,\n    y: userRect.top + userRect.height / 2\n  };\n  const relativeCoordinate = {\n    x: evt.clientX - centerCoor.x,\n    y: centerCoor.y - evt.clientY\n  };\n  const tan = relativeCoordinate.y / relativeCoordinate.x;\n  if (relativeCoordinate.x < 0) {\n    angle = Math.atan(tan) - Math.PI;\n  } else {\n    angle = Math.atan(tan);\n  }\n  const arrow = document.getElementById(_constants__WEBPACK_IMPORTED_MODULE_5__.ARROW_ID);\n  if (arrow) {\n    arrow.style.transform = `translateX(60px) translateY(-50%) rotate(${-angle * 180 / Math.PI}deg)`;\n  }\n}\nlet isEnterDown = false;\nfunction handleEnterDown() {\n  if (!isEnterDown && _store__WEBPACK_IMPORTED_MODULE_2__.store.state.blockOwner === _models__WEBPACK_IMPORTED_MODULE_4__.BlockOwner.USER) {\n    isEnterDown = true;\n    let force = 0;\n    const ticker = (0,_utils_time__WEBPACK_IMPORTED_MODULE_1__.createInfiniteTicker)(timeSpent => {\n      force += timeSpent;\n    });\n    function onKeyUp() {\n      ticker.cancel();\n      window.removeEventListener('keyup', onKeyUp);\n      isEnterDown = false;\n    }\n    ticker.promise.then(() => {\n      _store__WEBPACK_IMPORTED_MODULE_2__.store.blockOwner = undefined;\n      const userRect = user.getBoundingClientRect();\n      throwTnt({\n        x: userRect.left - fieldRect.left + userRect.width / 2,\n        y: userRect.top - fieldRect.top + userRect.height / 2\n      }, force, angle, [barrier, document.getElementById('bonfire')]);\n    });\n    window.addEventListener('keyup', onKeyUp);\n  }\n}\nfunction isBumpedIntoTarget(objectMetrics, targetMetrics) {\n  return objectMetrics.y + objectMetrics.height > targetMetrics.y && objectMetrics.x + objectMetrics.width > targetMetrics.x && objectMetrics.x < targetMetrics.x + targetMetrics.width;\n}\nwindow.addEventListener('keydown', evt => {\n  if (evt.key === 'Enter') {\n    handleEnterDown();\n  } else if (evt.key === 'ArrowLeft' || evt.key === 'ArrowRight') {\n    const SPEED = 0.5;\n    const changePositionBy = evt.key === 'ArrowLeft' ? -1 : 1;\n    const userRect = user.getBoundingClientRect();\n    const ticker = (0,_utils_time__WEBPACK_IMPORTED_MODULE_1__.createInfiniteTicker)(timeSpent => {\n      userPosition = Math.max(0, Math.min(barrierRect.left - fieldRect.left - userRect.width, userPosition + timeSpent * SPEED * changePositionBy));\n      user.style.transform = `translateX(${userPosition}px)`;\n    });\n    function onKeyUp() {\n      ticker.cancel();\n      window.removeEventListener('keyup', onKeyUp);\n    }\n    window.addEventListener('keyup', onKeyUp);\n  }\n});\n_store__WEBPACK_IMPORTED_MODULE_2__.store.subscribe(_store__WEBPACK_IMPORTED_MODULE_2__.StoreEvent.BLOCK_OWNER_CHANGE, () => {\n  if (_store__WEBPACK_IMPORTED_MODULE_2__.store.state.blockOwner) {\n    window.addEventListener('mousemove', onMouseMove);\n  } else {\n    window.removeEventListener('mousemove', onMouseMove);\n  }\n});\n_store__WEBPACK_IMPORTED_MODULE_2__.store.blockOwner = _models__WEBPACK_IMPORTED_MODULE_4__.BlockOwner.USER;\n\n//# sourceURL=webpack://university-layout-and-prototyping/./src/game.js?");

/***/ }),

/***/ "./src/models.js":
/*!***********************!*\
  !*** ./src/models.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BlockOwner: () => (/* binding */ BlockOwner)\n/* harmony export */ });\nconst BlockOwner = {\n  USER: 'user',\n  COMPUTER: 'computer'\n};\n\n//# sourceURL=webpack://university-layout-and-prototyping/./src/models.js?");

/***/ }),

/***/ "./src/store/index.js":
/*!****************************!*\
  !*** ./src/store/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Store: () => (/* binding */ Store),\n/* harmony export */   StoreEvent: () => (/* binding */ StoreEvent),\n/* harmony export */   store: () => (/* binding */ store)\n/* harmony export */ });\n/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observer */ \"./src/store/observer.js\");\n\nconst StoreEvent = {\n  BLOCK_OWNER_CHANGE: 'BLOCK_OWNER_CHANGE',\n  APPLICATION_STATE_CHANGE: 'APPLICATION_STATE_CHANGE',\n  USER_STATS_CHANGE: 'USER_STATS_CHANGE'\n};\nclass Store extends _observer__WEBPACK_IMPORTED_MODULE_0__.Observer {\n  set blockOwner(value) {\n    this.state.blockOwner = value;\n    this.notify(StoreEvent.BLOCK_OWNER_CHANGE);\n  }\n  set applicationStage(value) {\n    this.state.applicationStage = value;\n    this.notify(StoreEvent.APPLICATION_STATE_CHANGE);\n  }\n  set userStats(value) {\n    this.state.userStats = value;\n    this.notify(StoreEvent.USER_STATS_CHANGE);\n  }\n}\nconst store = new Store();\n\n//# sourceURL=webpack://university-layout-and-prototyping/./src/store/index.js?");

/***/ }),

/***/ "./src/store/observer.js":
/*!*******************************!*\
  !*** ./src/store/observer.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Observer: () => (/* binding */ Observer)\n/* harmony export */ });\nclass Observer {\n  observers = {};\n  constructor(state = {}) {\n    this.state = state;\n  }\n  subscribe(event, observer) {\n    if (this.observers[event]) {\n      this.observers[event].push(observer);\n    } else {\n      this.observers[event] = [observer];\n    }\n  }\n  unsubscribe(event, observer) {\n    if (this.observers[event]) {\n      this.observers[event] = this.observers[event].filter(obs => obs !== observer);\n    }\n  }\n  notify(event) {\n    if (this.observers[event]) {\n      this.observers[event].forEach(observer => observer());\n    }\n  }\n}\n\n//# sourceURL=webpack://university-layout-and-prototyping/./src/store/observer.js?");

/***/ }),

/***/ "./src/userBlockOwner.js":
/*!*******************************!*\
  !*** ./src/userBlockOwner.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/store */ \"./src/store/index.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/models */ \"./src/models.js\");\n/* harmony import */ var _components_tnt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/tnt */ \"./src/components/tnt.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/constants */ \"./src/constants.js\");\n/* harmony import */ var _components_arrow__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/components/arrow */ \"./src/components/arrow.js\");\n\n\n\n\n\nlet tnt;\nlet arrow;\n_store__WEBPACK_IMPORTED_MODULE_0__.store.subscribe(_store__WEBPACK_IMPORTED_MODULE_0__.StoreEvent.BLOCK_OWNER_CHANGE, () => {\n  if (_store__WEBPACK_IMPORTED_MODULE_0__.store.state.blockOwner === _models__WEBPACK_IMPORTED_MODULE_1__.BlockOwner.USER) {\n    const userOwner = document.getElementById(_constants__WEBPACK_IMPORTED_MODULE_3__.USER_OWNER_ID);\n    if (userOwner) {\n      tnt = (0,_components_tnt__WEBPACK_IMPORTED_MODULE_2__.createTnt)({\n        isActive: true\n      });\n      arrow = (0,_components_arrow__WEBPACK_IMPORTED_MODULE_4__.createArrow)();\n      userOwner.append(tnt, arrow);\n    }\n  } else {\n    tnt.remove();\n    tnt = undefined;\n    arrow.remove();\n    arrow = undefined;\n  }\n});\n\n//# sourceURL=webpack://university-layout-and-prototyping/./src/userBlockOwner.js?");

/***/ }),

/***/ "./src/utils/time.js":
/*!***************************!*\
  !*** ./src/utils/time.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   convertToTimeLeftRepresentation: () => (/* binding */ convertToTimeLeftRepresentation),\n/* harmony export */   createDurationTicker: () => (/* binding */ createDurationTicker),\n/* harmony export */   createInfiniteAbsoluteTicker: () => (/* binding */ createInfiniteAbsoluteTicker),\n/* harmony export */   createInfiniteTicker: () => (/* binding */ createInfiniteTicker)\n/* harmony export */ });\nfunction createDurationTicker(duration, ratioHandler) {\n  let needToCancel = false;\n  const cancel = () => needToCancel = true;\n  const promise = new Promise(resolve => {\n    const ticksStartFrom = Date.now();\n    const tick = () => {\n      const now = Date.now();\n      const spentTime = now - ticksStartFrom;\n      if (spentTime < duration && !needToCancel) {\n        ratioHandler(spentTime / duration);\n        requestAnimationFrame(tick);\n      } else {\n        resolve();\n      }\n    };\n    requestAnimationFrame(tick);\n  });\n  return {\n    promise,\n    cancel\n  };\n}\nfunction createInfiniteTicker(timeSpentHandler) {\n  let needToCancel = false;\n  const cancel = () => needToCancel = true;\n  const promise = new Promise(resolve => {\n    let lastTickTime = Date.now();\n    const tick = () => {\n      const now = Date.now();\n      const timeSpent = now - lastTickTime;\n      lastTickTime = now;\n      if (!needToCancel) {\n        timeSpentHandler(timeSpent);\n        requestAnimationFrame(tick);\n      } else {\n        resolve();\n      }\n    };\n    requestAnimationFrame(tick);\n  });\n  return {\n    promise,\n    cancel\n  };\n}\nfunction createInfiniteAbsoluteTicker(timeSpentHandler) {\n  let needToCancel = false;\n  let cancelValue;\n  const cancel = value => {\n    needToCancel = true;\n    cancelValue = value;\n  };\n  const promise = new Promise(resolve => {\n    const timeGoesFrom = Date.now();\n    const tick = () => {\n      const now = Date.now();\n      const timeSpent = now - timeGoesFrom;\n      if (!needToCancel) {\n        timeSpentHandler(timeSpent);\n        requestAnimationFrame(tick);\n      } else {\n        resolve(cancelValue);\n      }\n    };\n    requestAnimationFrame(tick);\n  });\n  return {\n    promise,\n    cancel\n  };\n}\nfunction convertToTimeLeftRepresentation(timeMillis) {\n  const timeSeconds = Math.round(timeMillis / 1000);\n  const secondsLeftRepresentation = (timeSeconds % 60).toString().padStart(2, '0');\n  const minutesLeftRepresentation = Math.floor(timeSeconds / 60).toString().padStart(2, '0');\n  return `${minutesLeftRepresentation}:${secondsLeftRepresentation}`;\n}\n\n//# sourceURL=webpack://university-layout-and-prototyping/./src/utils/time.js?");

/***/ }),

/***/ "./src/index.scss":
/*!************************!*\
  !*** ./src/index.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://university-layout-and-prototyping/./src/index.scss?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/game.js");
/******/ 	
/******/ })()
;