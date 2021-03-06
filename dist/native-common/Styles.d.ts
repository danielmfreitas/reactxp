import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Styles extends RX.Styles {
    combine<S>(ruleSet1: Types.StyleRuleSetRecursive<S> | undefined, ruleSet2?: Types.StyleRuleSetRecursive<S>): Types.StyleRuleSetOrArray<S> | undefined;
    createViewStyle(ruleSet: Types.ViewStyle, cacheStyle?: boolean): Types.ViewStyleRuleSet;
    createAnimatedViewStyle(ruleSet: Types.AnimatedViewStyle): Types.AnimatedViewStyleRuleSet;
    createScrollViewStyle(ruleSet: Types.ScrollViewStyle, cacheStyle?: boolean): Types.ScrollViewStyleRuleSet;
    createButtonStyle(ruleSet: Types.ButtonStyle, cacheStyle?: boolean): Types.ButtonStyleRuleSet;
    createWebViewStyle(ruleSet: Types.WebViewStyle, cacheStyle?: boolean): Types.WebViewStyleRuleSet;
    createTextStyle(ruleSet: Types.TextStyle, cacheStyle?: boolean): Types.TextStyleRuleSet;
    createAnimatedTextStyle(ruleSet: Types.AnimatedTextStyle): Types.AnimatedTextStyleRuleSet;
    createTextInputStyle(ruleSet: Types.TextInputStyle, cacheStyle?: boolean): Types.TextInputStyleRuleSet;
    createAnimatedTextInputStyle(ruleSet: Types.AnimatedTextInputStyle): Types.AnimatedTextInputStyleRuleSet;
    createImageStyle(ruleSet: Types.ImageStyle, cacheStyle?: boolean): Types.ImageStyleRuleSet;
    createAnimatedImageStyle(ruleSet: Types.AnimatedImageStyle): Types.AnimatedImageStyleRuleSet;
    createLinkStyle(ruleSet: Types.LinkStyle, cacheStyle?: boolean): Types.LinkStyleRuleSet;
    createPickerStyle(ruleSet: Types.PickerStyle, cacheStyle?: boolean): Types.PickerStyleRuleSet;
    getCssPropertyAliasesCssStyle(): {
        [key: string]: string;
    };
    private _adaptStyles<S>(def, cacheStyle);
    private _adaptAnimatedStyles<T>(def);
}
declare const _default: Styles;
export default _default;
