"use strict";
/**
* Image.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Image abstraction.
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var PropTypes = require("prop-types");
var React = require("react");
var RN = require("react-native");
var SyncTasks = require("synctasks");
var _ = require("./lodashMini");
var Styles_1 = require("./Styles");
var _styles = {
    defaultImage: Styles_1.default.createImageStyle({
        flex: 0,
        overflow: 'hidden',
        width: undefined,
        height: undefined
    })
};
var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    function Image() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._mountedComponent = null;
        _this._onMount = function (component) {
            _this._mountedComponent = component;
        };
        _this._onLoad = function (e) {
            if (!_this._mountedComponent) {
                return;
            }
            var nativeEvent = e.nativeEvent;
            _this._nativeImageWidth = nativeEvent.source.width;
            _this._nativeImageHeight = nativeEvent.source.height;
            if (_this.props.onLoad) {
                _this.props.onLoad({ width: _this._nativeImageWidth, height: _this._nativeImageHeight });
            }
        };
        _this._onError = function (e) {
            if (!_this._mountedComponent) {
                return;
            }
            if (_this.props.onError) {
                var event_1 = e.nativeEvent;
                _this.props.onError(new Error(event_1.error));
            }
        };
        return _this;
    }
    Image.prefetch = function (url) {
        var defer = SyncTasks.Defer();
        RN.Image.prefetch(url).then(function (value) {
            defer.resolve(value);
        }).catch(function (error) {
            defer.reject(error);
        });
        return defer.promise();
    };
    Image.prototype._getAdditionalProps = function () {
        return {};
    };
    Image.prototype.render = function () {
        // Check if require'd image resource
        var imageSource;
        if (_.isNumber(this.props.source)) {
            // Cast to any since the inbound types mismatch a bit for RN
            imageSource = this.props.source;
        }
        else {
            var imageSourceReq = { uri: this.props.source };
            if (this.props.headers) {
                imageSourceReq.headers = this.props.headers;
            }
            imageSource = imageSourceReq;
        }
        // Use the width/height provided in the style if it's not provided in the image itself.
        var resizeMode = 'contain';
        if (this.props.resizeMode !== undefined &&
            (this.props.resizeMode === 'contain' ||
                this.props.resizeMode === 'cover' ||
                this.props.resizeMode === 'stretch')) {
            resizeMode = this.props.resizeMode;
        }
        var additionalProps = this._getAdditionalProps();
        return (React.createElement(RN.Image, __assign({ ref: this._onMount, style: this.getStyles(), source: imageSource, resizeMode: resizeMode, resizeMethod: this.props.resizeMethod, accessibilityLabel: this.props.accessibilityLabel, onLoad: this.props.onLoad ? this._onLoad : undefined, onError: this._onError, shouldRasterizeIOS: this.props.shouldRasterizeIOS }, additionalProps), this.props.children));
    };
    Image.prototype.setNativeProps = function (nativeProps) {
        if (this._mountedComponent) {
            this._mountedComponent.setNativeProps(nativeProps);
        }
    };
    Image.prototype.getChildContext = function () {
        // Let descendant RX components know that their nearest RX ancestor is not an RX.Text.
        // Because they're in an RX.View/etc, they should use their normal styling rather than their
        // special styling for appearing inline with text.
        return { isRxParentAText: false };
    };
    Image.prototype.getStyles = function () {
        return [_styles.defaultImage, this.props.style];
    };
    // Note: This works only if you have an onLoaded handler and wait for the image to load.
    Image.prototype.getNativeWidth = function () {
        return this._nativeImageWidth;
    };
    Image.prototype.getNativeHeight = function () {
        return this._nativeImageHeight;
    };
    Image.childContextTypes = {
        isRxParentAText: PropTypes.bool.isRequired,
    };
    return Image;
}(React.Component));
exports.Image = Image;
exports.default = Image;
