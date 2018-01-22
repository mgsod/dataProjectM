/**
 * Created by Administrator on 2017/2/15.
 */
define('ck', ['ck_defaultclick', 'ck_menu', 'ck_pagination', 'ck_progress'], function (ck_defaultclick, ck_menu, ck_pagination, ck_progress) {
    var ck = {
        popup: ck_defaultclick,
        menu: ck_menu,
        pagination: ck_pagination,
        progress: ck_progress,
        param: function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += ck.param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '.' + subName;
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += ck.param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                        + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        }
    };
    /**
     * 控制altBox
     * @param e
     */
    window.showAlt = function (e) {
        var $myAlt = $('#myAlt');
        var message = $(e).attr('message');
        $myAlt.html(message.replace(/\,/g, ', '));
        $myAlt.show();
        var offset = $(e).offset();
        var top = offset.top - $('.ck_topbar').height() + $(e).height();
        if (offset.top > document.body.clientHeight / 2) {
            top = top - $myAlt.height() - $(e).height() * 3 / 2;
        }
        var left = offset.left - $('.ck_content').offset().left + $(e).width();
        if (offset.left > document.body.clientWidth / 2) {
            left = left - $(e).width() - $myAlt.width();
        }
        $myAlt.animate({left: left, top: top, opacity: 1}, 50)
    };
    /**
     * 隐藏alt
     */
    window.hideAlt = function () {
        var $myAlt = $('#myAlt');
        $myAlt.animate({opacity: 0}, 5);
        $myAlt.hide();
    };
    return ck;
});