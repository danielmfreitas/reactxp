"use strict";
/**
* GestureView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform GestureView component.
* It provides support for the scroll wheel, clicks and double clicks.
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
var _ = require("./utils/lodashMini");
var React = require("react");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var MouseResponder_1 = require("./utils/MouseResponder");
var RX = require("../common/Interfaces");
var Styles_1 = require("./Styles");
var Types = require("../common/Types");
var _styles = {
    defaultView: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        alignItems: 'stretch',
        justifyContent: 'center'
    }
};
var _doubleTapDurationThreshold = 250;
var _doubleTapPixelThreshold = 20;
var _panPixelThreshold = 10;
var _preferredPanRatio = 3;
var GestureType;
(function (GestureType) {
    GestureType[GestureType["None"] = 0] = "None";
    GestureType[GestureType["Pan"] = 1] = "Pan";
    GestureType[GestureType["PanVertical"] = 2] = "PanVertical";
    GestureType[GestureType["PanHorizontal"] = 3] = "PanHorizontal";
})(GestureType || (GestureType = {}));
var _idCounter = 1;
var GestureView = /** @class */ (function (_super) {
    __extends(GestureView, _super);
    function GestureView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._id = _idCounter++;
        // private _pendingGestureState: Types.PanGestureState = null;
        _this._pendingGestureType = GestureType.None;
        _this._gestureTypeLocked = false;
        _this._skipNextTap = false;
        _this._setContainerRef = function (container) {
            // safe since div refs resolve into HTMLElement and not react element.
            _this._container = container;
            if (container) {
                _this._createMouseResponder(container);
            }
            else {
                _this._disposeMouseResponder();
            }
        };
        _this._onClick = function (e) {
            if (!_this.props.onDoubleTap) {
                // If there is no double-tap handler, we can invoke the tap handler immediately.
                _this._sendTapEvent(e);
            }
            else if (_this._isDoubleTap(e)) {
                // This is a double-tap, so swallow the previous single tap.
                _this._cancelDoubleTapTimer();
                _this._sendDoubleTapEvent(e);
                _this._lastTapEvent = undefined;
            }
            else {
                // This wasn't a double-tap. Report any previous single tap and start the double-tap
                // timer so we can determine whether the current tap is a single or double.
                _this._reportDelayedTap();
                _this._startDoubleTapTimer(e);
            }
        };
        _this._detectGestureType = function (gestureState) {
            // we need to lock gesture type until it's completed
            if (_this._gestureTypeLocked) {
                return _this._pendingGestureType;
            }
            _this._gestureTypeLocked = true;
            if (_this._shouldRespondToPan(gestureState)) {
                return GestureType.Pan;
            }
            else if (_this._shouldRespondToPanVertical(gestureState)) {
                return GestureType.PanVertical;
            }
            else if (_this._shouldRespondToPanHorizontal(gestureState)) {
                return GestureType.PanHorizontal;
            }
            _this._gestureTypeLocked = false;
            return GestureType.None;
        };
        _this._getPanPixelThreshold = function () {
            return (!_.isUndefined(_this.props.panPixelThreshold) && _this.props.panPixelThreshold > 0) ?
                _this.props.panPixelThreshold : _panPixelThreshold;
        };
        _this._onWheel = function (e) {
            if (_this.props.onScrollWheel) {
                var clientRect = _this._getGestureViewClientRect();
                if (clientRect) {
                    var scrollWheelEvent = {
                        clientX: e.clientX - clientRect.left,
                        clientY: e.clientY - clientRect.top,
                        pageX: e.pageX,
                        pageY: e.pageY,
                        scrollAmount: e.deltaY,
                        timeStamp: e.timeStamp
                    };
                    _this.props.onScrollWheel(scrollWheelEvent);
                }
            }
        };
        _this._sendPanEvent = function (gestureState) {
            switch (_this._pendingGestureType) {
                case GestureType.Pan:
                    if (_this.props.onPan) {
                        _this.props.onPan(gestureState);
                    }
                    break;
                case GestureType.PanVertical:
                    if (_this.props.onPanVertical) {
                        _this.props.onPanVertical(gestureState);
                    }
                    break;
                case GestureType.PanHorizontal:
                    if (_this.props.onPanHorizontal) {
                        _this.props.onPanHorizontal(gestureState);
                    }
                    break;
                default:
            }
            // we need to clean taps in case there was a pan event in the meantime
            if (_this._pendingGestureType !== GestureType.None) {
                _this._lastTapEvent = undefined;
                _this._cancelDoubleTapTimer();
                _this._skipNextTap = true;
            }
        };
        return _this;
    }
    GestureView.prototype.componentWillUnmount = function () {
        // Dispose of timer before the component goes away.
        this._cancelDoubleTapTimer();
    };
    GestureView.prototype.render = function () {
        var ariaRole = AccessibilityUtil_1.default.accessibilityTraitToString(this.props.accessibilityTraits);
        var isAriaHidden = AccessibilityUtil_1.default.isHidden(this.props.importantForAccessibility);
        return (React.createElement("div", { style: this._getStyles(), ref: this._setContainerRef, onClick: this._onClick, onWheel: this._onWheel, role: ariaRole, "aria-label": this.props.accessibilityLabel, "aria-hidden": isAriaHidden }, this.props.children));
    };
    GestureView.prototype._createMouseResponder = function (container) {
        var _this = this;
        this._disposeMouseResponder();
        this._responder = MouseResponder_1.default.create({
            id: this._id,
            target: container,
            shouldBecomeFirstResponder: function (event) {
                if (!_this.props.onPan && !_this.props.onPanHorizontal && !_this.props.onPanVertical) {
                    return false;
                }
                var boundingRect = _this._getGestureViewClientRect();
                if (!boundingRect) {
                    return false;
                }
                var top = boundingRect.top, left = boundingRect.left, bottom = boundingRect.bottom, right = boundingRect.right;
                var clientX = event.clientX, clientY = event.clientY;
                if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) {
                    return true;
                }
                return false;
            },
            onMove: function (event, gestureState) {
                _this._pendingGestureType = _this._detectGestureType(gestureState);
                _this._sendPanEvent(gestureState);
            },
            onTerminate: function (event, gestureState) {
                _this._pendingGestureType = _this._detectGestureType(gestureState);
                _this._sendPanEvent(gestureState);
                _this._pendingGestureType = GestureType.None;
                _this._gestureTypeLocked = false;
            }
        });
    };
    GestureView.prototype._disposeMouseResponder = function () {
        if (this._responder) {
            this._responder.dispose();
            delete this._responder;
        }
    };
    GestureView.prototype._getStyles = function () {
        var combinedStyles = Styles_1.default.combine([_styles.defaultView, this.props.style]);
        var cursorName;
        switch (this.props.mouseOverCursor) {
            case Types.GestureMouseCursor.Grab:
                cursorName = 'grab';
                break;
            case Types.GestureMouseCursor.Move:
                cursorName = 'move';
                break;
            case Types.GestureMouseCursor.Pointer:
                cursorName = 'pointer';
                break;
        }
        if (cursorName) {
            combinedStyles['cursor'] = cursorName;
        }
        return combinedStyles;
    };
    GestureView.prototype._shouldRespondToPan = function (gestureState) {
        if (!this.props.onPan) {
            return false;
        }
        var threshold = this._getPanPixelThreshold();
        var distance = this._calcDistance(gestureState.clientX - gestureState.initialClientX, gestureState.clientY - gestureState.initialClientY);
        if (distance < threshold) {
            return false;
        }
        return true;
    };
    GestureView.prototype._shouldRespondToPanVertical = function (gestureState) {
        if (!this.props.onPanVertical) {
            return false;
        }
        var dx = gestureState.clientX - gestureState.initialClientX;
        var dy = gestureState.clientY - gestureState.initialClientY;
        // Has the user started to pan?
        var panThreshold = this._getPanPixelThreshold();
        var isPan = Math.abs(dy) >= panThreshold;
        if (isPan && this.props.preferredPan === Types.PreferredPanGesture.Horizontal) {
            return Math.abs(dy) > Math.abs(dx * _preferredPanRatio);
        }
        return isPan;
    };
    GestureView.prototype._shouldRespondToPanHorizontal = function (gestureState) {
        if (!this.props.onPanHorizontal) {
            return false;
        }
        var dx = gestureState.clientX - gestureState.initialClientX;
        var dy = gestureState.clientY - gestureState.initialClientY;
        // Has the user started to pan?
        var panThreshold = this._getPanPixelThreshold();
        var isPan = Math.abs(dx) >= panThreshold;
        if (isPan && this.props.preferredPan === Types.PreferredPanGesture.Vertical) {
            return Math.abs(dx) > Math.abs(dy * _preferredPanRatio);
        }
        return isPan;
    };
    GestureView.prototype._calcDistance = function (dx, dy) {
        return Math.sqrt(dx * dx + dy * dy);
    };
    // This method assumes that the caller has already determined that two
    // clicks have been detected in a row. It is responsible for determining if
    // they occurred within close proximity and within a certain threshold of time.
    GestureView.prototype._isDoubleTap = function (e) {
        var timeStamp = e.timeStamp.valueOf();
        var pageX = e.pageX;
        var pageY = e.pageY;
        if (!this._lastTapEvent) {
            return false;
        }
        return (timeStamp - this._lastTapEvent.timeStamp.valueOf() <= _doubleTapDurationThreshold &&
            this._calcDistance(this._lastTapEvent.pageX - pageX, this._lastTapEvent.pageY - pageY) <=
                _doubleTapPixelThreshold);
    };
    // Starts a timer that reports a previous tap if it's not canceled by a subsequent gesture.
    GestureView.prototype._startDoubleTapTimer = function (e) {
        var _this = this;
        this._lastTapEvent = _.clone(e);
        this._doubleTapTimer = window.setTimeout(function () {
            _this._reportDelayedTap();
            _this._doubleTapTimer = undefined;
        }, _doubleTapDurationThreshold);
    };
    // Cancels any pending double-tap timer.
    GestureView.prototype._cancelDoubleTapTimer = function () {
        if (this._doubleTapTimer) {
            clearTimeout(this._doubleTapTimer);
            this._doubleTapTimer = undefined;
        }
    };
    // If there was a previous tap recorded but we haven't yet reported it because we were
    // waiting for a potential second tap, report it now.
    GestureView.prototype._reportDelayedTap = function () {
        if (this._lastTapEvent && this.props.onTap) {
            this._sendTapEvent(this._lastTapEvent);
            this._lastTapEvent = undefined;
        }
    };
    GestureView.prototype._sendTapEvent = function (e) {
        // we need to skip tap after succesfull pan event
        // mouse up would otherwise trigger both pan & tap
        if (this._skipNextTap) {
            this._skipNextTap = false;
            return;
        }
        if (this.props.onTap) {
            var clientRect = this._getGestureViewClientRect();
            if (clientRect) {
                var tapEvent = {
                    pageX: e.pageX,
                    pageY: e.pageY,
                    clientX: e.clientX - clientRect.left,
                    clientY: e.clientY - clientRect.top,
                    timeStamp: e.timeStamp
                };
                this.props.onTap(tapEvent);
            }
        }
    };
    GestureView.prototype._sendDoubleTapEvent = function (e) {
        if (this.props.onDoubleTap) {
            var clientRect = this._getGestureViewClientRect();
            if (clientRect) {
                var tapEvent = {
                    pageX: e.pageX,
                    pageY: e.pageY,
                    clientX: e.clientX - clientRect.left,
                    clientY: e.clientY - clientRect.top,
                    timeStamp: e.timeStamp
                };
                this.props.onDoubleTap(tapEvent);
            }
        }
    };
    GestureView.prototype._getGestureViewClientRect = function () {
        return this._container ? this._container.getBoundingClientRect() : null;
    };
    return GestureView;
}(RX.ViewBase));
exports.GestureView = GestureView;
exports.default = GestureView;
