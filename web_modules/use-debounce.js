import { b as react_26, j as react_18, i as react_21, f as react_27 } from './common/index-631f69c8.js';

function useDebouncedCallback(callback, delay, options) {
    if (options === void 0) { options = {}; }
    var maxWait = options.maxWait;
    var maxWaitHandler = react_26(null);
    var maxWaitArgs = react_26([]);
    var leading = options.leading;
    var trailing = options.trailing === undefined ? true : options.trailing;
    var leadingCall = react_26(false);
    var functionTimeoutHandler = react_26(null);
    var isComponentUnmounted = react_26(false);
    var debouncedFunction = react_26(callback);
    debouncedFunction.current = callback;
    var cancelDebouncedCallback = react_18(function () {
        clearTimeout(functionTimeoutHandler.current);
        clearTimeout(maxWaitHandler.current);
        maxWaitHandler.current = null;
        maxWaitArgs.current = [];
        functionTimeoutHandler.current = null;
        leadingCall.current = false;
    }, []);
    react_21(function () { return function () {
        // we use flag, as we allow to call callPending outside the hook
        isComponentUnmounted.current = true;
    }; }, []);
    var debouncedCallback = react_18(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        maxWaitArgs.current = args;
        clearTimeout(functionTimeoutHandler.current);
        if (leadingCall.current) {
            leadingCall.current = false;
        }
        if (!functionTimeoutHandler.current && leading && !leadingCall.current) {
            debouncedFunction.current.apply(debouncedFunction, args);
            leadingCall.current = true;
        }
        functionTimeoutHandler.current = setTimeout(function () {
            var shouldCallFunction = true;
            if (leading && leadingCall.current) {
                shouldCallFunction = false;
            }
            cancelDebouncedCallback();
            if (!isComponentUnmounted.current && trailing && shouldCallFunction) {
                debouncedFunction.current.apply(debouncedFunction, args);
            }
        }, delay);
        if (maxWait && !maxWaitHandler.current && trailing) {
            maxWaitHandler.current = setTimeout(function () {
                var args = maxWaitArgs.current;
                cancelDebouncedCallback();
                if (!isComponentUnmounted.current) {
                    debouncedFunction.current.apply(null, args);
                }
            }, maxWait);
        }
    }, [maxWait, delay, cancelDebouncedCallback, leading, trailing]);
    var callPending = react_18(function () {
        // Call pending callback only if we have anything in our queue
        if (!functionTimeoutHandler.current) {
            return;
        }
        debouncedFunction.current.apply(null, maxWaitArgs.current);
        cancelDebouncedCallback();
    }, [cancelDebouncedCallback]);
    // At the moment, we use 3 args array so that we save backward compatibility
    return [debouncedCallback, cancelDebouncedCallback, callPending];
}

function valueEquality(left, right) {
    return left === right;
}
function useDebounce(value, delay, options) {
    var eq = options && options.equalityFn ? options.equalityFn : valueEquality;
    var _a = react_27(value), state = _a[0], dispatch = _a[1];
    var _b = useDebouncedCallback(react_18(function (value) { return dispatch(value); }, []), delay, options), callback = _b[0], cancel = _b[1], callPending = _b[2];
    var previousValue = react_26(value);
    react_21(function () {
        // We need to use this condition otherwise we will run debounce timer for the first render (including maxWait option)
        if (!eq(previousValue.current, value)) {
            callback(value);
            previousValue.current = value;
        }
    }, [value, callback, eq]);
    return [state, cancel, callPending];
}

export { useDebounce, useDebouncedCallback };
