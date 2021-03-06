/// <reference types="react" />
import RN = require('react-native');
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
import ViewBase from './ViewBase';
export declare class ScrollView extends ViewBase<Types.ScrollViewProps, {}> implements RX.ScrollView {
    private _scrollTop;
    private _scrollLeft;
    protected _nativeView: RN.ScrollView | undefined;
    protected _render(props: RN.ScrollViewProps): JSX.Element;
    render(): JSX.Element;
    private _onScroll;
    setScrollTop(scrollTop: number, animate?: boolean): void;
    setScrollLeft(scrollLeft: number, animate?: boolean): void;
    addToScrollTop(deltaTop: number, animate?: boolean): void;
    addToScrollLeft(deltaLeft: number, animate?: boolean): void;
    static useCustomScrollbars(): void;
}
export default ScrollView;
