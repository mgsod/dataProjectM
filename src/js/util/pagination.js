/**
 * Created by Administrator on 2017/3/2.
 */
define('pagination', ['math'], function (math) {
    var pagination = {
        page: 1,
        totalPage: 0,
        init: function (count, size) {
            this.totalPage = math.getPage(count, size);
            var pageList = math.numToList(this.totalPage);
            return {totalPage: this.totalPage, pageList: pageList}
        },
        goNextPage: function (param) {
            this.page = param == 'pre' && this.page > 1 ? parseInt(this.page) - 1 : param == 'next' && this.page < this.totalPage ? parseInt(this.page) + 1 : this.page;
            this.page = param == 'reset' ? 1 : this.page;
            this.page = param == 'first' ? 1 : this.page;
            this.page = param == 'last' ? this.totalPage : this.page;
            this.page = typeof param == 'number' ? param : this.page;
            return this.page;
        },
        getPage: function () {
            return this.page
        },
        getTotalPage: function () {
            return this.totalPage
        },
        setPage: function (page) {
            this.page = parseInt(page);
            return this.page;
        }
    };
    return pagination;
});