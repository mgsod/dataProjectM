/**
 * Created by intel on 2017/2/22.
 */
/**
 * Created by Administrator on 2017/2/15.
 */
define('regexp', function () {
    var regexp = {
        /**
         * 检查str
         * @param str
         * @param min
         * @param max
         * @param isNumber
         * @param capital
         * @returns {boolean}
         */
        checkStrMinMaxCaptital: function (str, min, max, isNumber, capital) {
            if (!this.checkStr(str)) {
                if (str.length >= min && !/[\u4e00-\u9fa5]/.test(str) && str.length <= max && /[a-z]/.test(str)) {
                    if (isNumber && /[0-9]/.test(str)) {
                        return false
                    } else {
                        if (capital && /[A-Z]/.test(str)) {
                            return false
                        } else {
                            return true
                        }
                    }
                } else {
                    return false;
                }
            } else {
                return false
            }
        },
        checkStrSp: function (str, max) {
            if (str.length <= max && /[@#$%^&\(\)=\|\\\{\}\[\];:'"><?\/~`]/.test(str)) {
                return true
            } else {
                return false;
            }
        },
        checkStr: function (str) {
            if (/[@#$!%^&\(\)=\|\\\{\}\[\];:'"><?\/~`]/.test(str)) {
                return true
            } else {
                return false;
            }
        },
        checkWeixinStr: function (str) {
            if (/!@#$%^&*\(\)-=+\|\\{\}\[\];:'"><?\/~`/.test(str)) {
                return true
            } else {
                return false;
            }
        }
    };
    return regexp;
});