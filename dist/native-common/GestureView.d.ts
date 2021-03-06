/// <reference types="react" />
import Types = require('../common/Types');
import ViewBase from './ViewBase';
export declare abstract class GestureView extends ViewBase<Types.GestureViewProps, {}> {
    private _panResponder;
    private _doubleTapTimer;
    private _pendingGestureType;
    private _pendingGestureState;
    private _lastTapEvent;
    private _lastGestureStartEvent;
    constructor(props: Types.GestureViewProps);
    componentWillUnmount(): void;
    protected abstract _getPreferredPanRatio(): number;
    protected abstract _getEventTimestamp(e: Types.TouchEvent): number;
    private _onPanResponderEnd(e, gestureState);
    private _setPendingGestureState(gestureState);
    private _detectMoveGesture(e, gestureState);
    private _isTap(e);
    private _isDoubleTap(e);
    private _startDoubleTapTimer(e);
    private _cancelDoubleTapTimer();
    private _reportDelayedTap();
    private _shouldRespondToPinchZoom(e, gestureState);
    private _shouldRespondToRotate(e, gestureState);
    private _shouldRespondToPan(gestureState);
    private _shouldRespondToPanVertical(gestureState);
    private _shouldRespondToPanHorizontal(gestureState);
    private _calcDistance(dx, dy);
    private _calcAngle(touches);
    private _radiansToDegrees(rad);
    private _sendMultiTouchEvents(e, gestureState, initializeFromEvent, isComplete);
    private _sendPanEvent(e, gestureState, gestureType, initializeFromEvent, isComplete);
    private _sendTapEvent(e);
    private _sendDoubleTapEvent(e);
    render(): JSX.Element;
}
export default GestureView;
