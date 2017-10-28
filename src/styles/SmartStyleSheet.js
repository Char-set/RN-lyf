import {
    StyleSheet,
    PixelRatio,
    Platform,
    Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');
var htmlFontSize = 16;

/**
 * object to match media query
 */
const MATCH_OBJECT = {
    width,
    height,
    'device-width': width,
    'device-height': height,
    orientation: width > height ? 'landscape' : 'portrait',
    'aspect-ratio': width / height,
    type: Platform.OS
};

/**
 * cache the calculated result
 */
const cache = {
    px: {},
    vw: {},
    vh: {},
    rem: {}
};

/**
 * transform px to layout size
 * @params px
 * @return layout size
 */
function calcPx(px) {
    let cachePx = cache.px[px];
    if(cachePx || cachePx === 0) {
        return cachePx;
    } else {
        return cache.px[px] = px * StyleSheet.hairlineWidth;
    }
}

/**
 * transform vw to layout size
 * @params vw
 * @return layout size
 */
function calcVw(vw) {
    let cacheVw = cache.vw[vw];
    if(cacheVw || cacheVw === 0) {
        return cacheVw;
    } else {
        return cache.vw[vw] = vw / 100 * width;
    }
}

/**
 * transform vh to layout size
 * @params vh
 * @return layout size
 */
function calcVh(vh) {
    let cacheVh = cache.vh[vh];
    if(cacheVh || cacheVh === 0) {
        return cacheVh;
    } else {
        return cache.vh[vh] = vh / 100 * height;
    }
}

/**
 * transform vh to layout size
 * @params vh
 * @return layout size
 */
function calcRem(rem) {
    let cacheRem = cache.rem[rem];
    if(cacheRem || cacheRem === 0) {
        return cacheRem;
    } else {
        return cache.rem[rem] = rem * htmlFontSize;
    }
}

/**
 * transform param to layout size
 * @params value
 * @return layout size
 */
const operators = ['+', '-', '*', '/'];
function calc(value, key) {
    let val, unitExec, calcExec;
    unitExec = /^([\d\.]+)([a-z]*)/.exec(value);
    if(unitExec && (val = unitExec[1])) {
        val = parseFloat(val);
        switch(unitExec[2]) {
            case 'px':
                val = calcPx(val);
                break;
            case 'vw':
                val = calcVw(val);
                break;
            case 'vh':
                val = calcVh(val);
                break;
            case 'rem':
                val = calcRem(val);
                break;
            case 'deg':
                val = value;
                break;
            default:
                if(['fontWeight'].indexOf(key) !== -1) {
                    val = String(val);
                } else {
                    val = parseFloat(val);
                }
        }
    } else if((calcExec = /^calc\(([^\)]+)\)/.exec(value)) && (val = calcExec[1])) {
        let exps = [];
        let vals = val.trim().split(/\s+/);
        var o = {};

        for (let j = 0, len = vals.length; j < len; j++) {
            if((val = vals[j]) && typeof val === 'string' && operators.indexOf(val.trim()) !== -1) {
               exps.push(val);
            } else {
               o[j] = calc(val);
               exps.push('o[' + j + ']');
            }
        }
        val = new Function('o', 'return ' + exps.join(' '))(o);
    } else {
        val = value;
    }
    return val;
}

/**
 * deep calculate unit
 * @params styles
 * @return formated styles
 */
function deepCalc(styles = {}) {
    Object.keys(styles).forEach(function (key) {
        if(typeof styles[key] === 'object') {
            return deepCalc(styles[key]);
        } else if(typeof styles[key] === 'string') {
            styles[key] = calc(styles[key], key);
        }
    });
    return styles;
}

/**
 * check whether is plain object
 */
function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * Is string is media query
 * @param {String} str
 */
function isMediaQuery(str) {
    return typeof str === 'string' && str.indexOf('@media') === 0;
}

/**
 * object assign
 * @params deep {optional}
 * @params target {required}
 * @params src {required}
 */
function extend() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
    }
    if (typeof target !== "object") {
        target = {};
    }
    if (length === i) {
        target = {};
        --i;
    }

    for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                //prevent deep-loop
                if (target === copy) {
                    continue;
                }
                if (deep && copy && ( (copyIsArray = Array.isArray(copy)) || isPlainObject(copy))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    target[name] = extend(deep, clone, copy);

                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
    var cache = Object.create(null);
    return (function cachedFn (str) {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    });
}

/**
 * Camelize a hyphen-delimited string
 */
var camelizeRE = /[-](\w)/g;
var camelize = cached(function (str) {
    return str.replace(camelizeRE, function(_, c) { return (c ? c.toUpperCase() : '')});
});

/**
 * Camelize the key of Object
 */
function camelizeKeys(obj) {
    var newObj = Object.create(null);
    if(obj) {
        Object.keys(obj).forEach(function(key) {
            if(isPlainObject(obj[key])) {
                newObj[key] = newObj[camelize(key)] = camelizeKeys(obj[key]);
            } else {
                newObj[key] = newObj[camelize(key)] = obj[key];
            }
        });
    }
    return newObj;
}

var RE_MEDIA_QUERY     = /^(?:(only|not)?\s*([_a-z][_a-z0-9-]*)|(\([^\)]+\)))(?:\s*and\s*(.*))?$/i,
    RE_MQ_EXPRESSION   = /^\(\s*([_a-z-][_a-z0-9-]*)\s*(?:\:\s*([^\)]+))?\s*\)$/,
    RE_MQ_FEATURE      = /^(?:(min|max)-)?(.+)/;

/**
 * transtorm radia to aspect-ratio
 */
function toDecimal(ratio) {
    var decimal = Number(ratio),
        numbers;

    if (!decimal) {
        numbers = ratio.match(/^(\d+)\s*\/\s*(\d+)$/);
        decimal = numbers[1] / numbers[2];
    }

    return decimal;
}

/**
 * check whether media query is matched
 */
function matchQuery(mediaQuery, values) {
    return parseQuery(mediaQuery).some(function (query) {
        var inverse = query.inverse;

        // Either the parsed or specified `type` is "all", or the types must be
        // equal for a match.
        var typeMatch = query.type === 'all' || values.type === query.type;

        // Quit early when `type` doesn't match, but take "not" into account.
        if ((typeMatch && inverse) || !(typeMatch || inverse)) {
            return false;
        }

        var expressionsMatch = query.expressions.every(function (expression) {
            var feature  = expression.feature,
                modifier = expression.modifier,
                expValue = expression.value,
                value    = values[feature];

            // Missing or falsy values don't match.
            if (!value) { return false; }

            switch (feature) {
                case 'orientation':
                case 'scan':
                    return value.toLowerCase() === expValue.toLowerCase();

                case 'width':
                case 'height':
                case 'device-width':
                case 'device-height':
                    if(/rem/.test(expValue)) {
                        throw new SyntaxError('Media query not supported rem.');
                    }
                    expValue = calc(expValue);
                    value    = calc(value);
                    break;

                case 'aspect-ratio':
                case 'device-aspect-ratio':
                    expValue = toDecimal(expValue);
                    value    = toDecimal(value);
                    break;

                case 'grid':
                case 'color':
                case 'color-index':
                case 'monochrome':
                    expValue = parseInt(expValue, 10) || 1;
                    value    = parseInt(value, 10) || 0;
                    break;
            }

            switch (modifier) {
                case 'min': return value >= expValue;
                case 'max': return value <= expValue;
                default   : return value === expValue;
            }
        });

        return (expressionsMatch && !inverse) || (!expressionsMatch && inverse);
    });
}

/**
 * parse media query string
 */
function parseQuery(mediaQuery) {
    return mediaQuery.split(',').map(function (query) {
        query = query.trim();

        var captures = query.match(RE_MEDIA_QUERY);

        // Media Query must be valid.
        if (!captures) {
            throw new SyntaxError('Invalid CSS media query: "' + query + '"');
        }

        var modifier    = captures[1],
            type        = captures[2],
            expressions = ((captures[3] || '') + (captures[4] || '')).trim(),
            parsed      = {};

        parsed.inverse = !!modifier && modifier.toLowerCase() === 'not';
        parsed.type    = type ? type.toLowerCase() : 'all';

        // Check for media query expressions.
        if (!expressions) {
            parsed.expressions = [];
            return parsed;
        }

        // Split expressions into a list.
        expressions = expressions.match(/\([^\)]+\)/g);

        // Media Query must be valid.
        if (!expressions) {
            throw new SyntaxError('Invalid CSS media query: "' + query + '"');
        }

        parsed.expressions = expressions.map(function (expression) {
            var captures = expression.match(RE_MQ_EXPRESSION);

            // Media Query must be valid.
            if (!captures) {
                throw new SyntaxError('Invalid CSS media query: "' + query + '"');
            }

            var feature = captures[1].toLowerCase().match(RE_MQ_FEATURE);

            return {
                modifier: feature[1],
                feature : feature[2],
                value   : captures[2]
            };
        });

        return parsed;
    });
}


var ReactNativePropRegistry = require('ReactNativePropRegistry');
var StyleSheetValidation = require('StyleSheetValidation');

/**
 * check whether is box-shadow
 */
function isBoxShadow(obj, key) {
    if(key === 'shadowOffset') {
        if(Object.keys(obj).length === 2 && 'width' in obj && 'height' in obj) {
            return true;
        }
    }
    return false;
}

/**
 * filter meida query
 */
function filterMediaQuery(styles = {}) {
    for (var key in styles) {
        let mqStr = key.replace('@media', '');

        if(isMediaQuery(key)) {
            if(matchQuery(mqStr, MATCH_OBJECT)) {
                extend(true, styles, styles[key]);
            }
            delete styles[key];
        }
    }
    return styles;
}

/**
 * register react native style
 */
function rnStyleSheetRegister(styles = {}) {
    const result = {};
    for (var key in styles) {
        let styleObj = styles[key];
        let styleObjKeys = Object.keys(styleObj);
        if(isPlainObject(styleObj[styleObjKeys[0]]) && !isBoxShadow(styleObj[styleObjKeys[0]], styleObjKeys[0])) {
            result[key] = rnStyleSheetRegister(styleObj);
        } else {
            StyleSheetValidation.validateStyle(key, styles);
            result[key] = ReactNativePropRegistry.register(styleObj);
        }
    }
    return result;
}

/**
 * create the react native style sheet
 * @params styles
 * @return react native styles
 */
export default class SmartStyleSheet {
    static create(styles = {}) {
        //filter matched css
        styles = filterMediaQuery(styles);
        //set html font size
        SmartStyleSheet.setHtmlFontSize(styles.html && styles.html.fontSize);
        //calculate unit
        styles = deepCalc(styles);
        styles = rnStyleSheetRegister(styles);

        return camelizeKeys(styles);
    }
    static setHtmlFontSize(fontSize) {
        if(/rem/.test(fontSize)) {
            throw new Error('The font size unit of html must be px vw, vh, or pt.');
        } else if(fontSize) {
            fontSize = calc(fontSize);
        }
        //clear rem cache
        if((fontSize || fontSize === 0) && fontSize !== htmlFontSize) {
            cache.rem = {};
        }
        htmlFontSize = fontSize || htmlFontSize || 16;
    }
}
