"use strict";
/**
* Input.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web implementation of Input interface.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var RX = require("../common/Interfaces");
var Input = /** @class */ (function (_super) {
    __extends(Input, _super);
    function Input() {
        return _super.call(this) || this;
    }
    Input.prototype.dispatchKeyDown = function (e) {
        this.keyDownEvent.fire(e);
    };
    Input.prototype.dispatchKeyUp = function (e) {
        if (this.keyUpEvent.fire(e)) {
            e.stopPropagation();
        }
    };
    return Input;
}(RX.Input));
exports.Input = Input;
exports.default = new Input();
