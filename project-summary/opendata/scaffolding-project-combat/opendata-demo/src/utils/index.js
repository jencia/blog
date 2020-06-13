import { COMMON_API_PREFIX } from '@/config/service';

/**
 * 获取url的查询参数值
 * 比如 test/abc/?a=1&b=2#/list?c=3&d=4 得到 {a:'1',b:'2',c:'3',d:'4'}
 * 不管是#之前的还是#之后的参数都能获取到
 * 不使用SearchParams是考虑到IE上的兼容性问题
 * @return {Object}
 */
export const getUrlSearch = () => {
    const searches = window.location.href
        .split(/#|\/#/)
        .map(v => {
            const index = v.indexOf('?');
            const len = v.length;

            return index === -1 ? '' : v.substring(index + 1, len);
        })
        .filter(v => v);

    return searches.reduce((result, search) => {
        const paramsStr = search.split('&');
        const paramsObj = paramsStr.reduce((rs, v) => {
            const [key, value] = v.split('=');

            rs[decodeURIComponent(key)] = decodeURIComponent(value);
            return rs;
        }, {});

        return Object.assign(result, paramsObj);
    }, {});
};

/**
 * 在原来的url上添加或修改查询参数值
 * 设置完之后#之前的参数会被合并到#之后的参数
 * @param {Object} obj                  需要修改或添加的参数
 * @param {boolean} [isCover=false]     是否覆盖所有参数，清除之前的参数
 */
export const setUrlSearch = (obj, isCover) => {
    const merge = isCover ? (obj || {}) : Object.assign({}, getUrlSearch(), obj || {});
    const urls = window.location.href
        .split('#')
        .map(v => {
            const index = v.indexOf('?');

            return index === -1 ? v : v.substring(0, index);
        })
        .filter(v => v);
    const search = Object.entries(merge)
        .filter(([, value]) => !!value)
        .reduce((rs, [key, value], i) => (
            `${rs + (i === 0 ? '?' : '&') + key}=${encodeURIComponent(value)}`
        ), '');

    window.location.href = urls.join('#') + search;
};

export const jumpToLogin = redirectUrl => {
    window.location.href = `${COMMON_API_PREFIX}/sso/pcLogin.do?redirectUrl=${redirectUrl || window.location.href}`;
};

// 加千分符
function _numberWithCommas(str) {
    if (str) {
        return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
        return str;
    }
}
function _fixedNum(number = 0, decimal = 0) {
    // const decimalNew = decimal ? 2 : 0;

    // 最多保留四位小数，省略小数位的0
    return parseFloat(Number(number).toFixed(decimal));
}
function _getDivider(num) {
    const divides = [
        { min: 0, divider: 1, unit: '' },
        { min: 1000000, divider: 10000, unit: '万' },
        { min: 100000000, divider: 100000000, unit: '亿' }
    ];

    for (let i = divides.length - 1; i > 0; i--) {
        const item = divides[i];

        if (Math.abs(num) >= item.min) return item;
    }
    return divides[0];
}
export const convertNum = (numParam = 0, splitCells = false) => {
    let num = numParam ? numParam : 0;
    const divider = _getDivider(num);
    const remainder = `${_fixedNum(num)}`.length % 4; // 除4取余数
    const fixedLength = remainder === 0 ? 0 : 4 - remainder; // 获取保留小数位数

    num = _fixedNum(num / divider.divider, fixedLength); // 万、亿位转换

    num = _numberWithCommas(num); // 添加千分符

    if (splitCells) {
        return { value: num, unit: divider.unit };
    }
    return `${num}${divider.unit}`;
};

/*
 * 日期格式化
 * 将其他格式的日期转化成“YYYY-MM-DD格式”
 * 调用dateFormat(date, "yyyy-MM-dd");
 * */
export const dateFormat = (date, format) => {
    let mapDate = date;

    if (!mapDate) return '';
    if (typeof date === 'string') {
        mapDate = mapDate.trim();
        if (mapDate.indexOf('/') !== -1) {
            const newDate = mapDate.split('/');

            if (newDate[1].toString().length === 1) {
                newDate[1] = `0${newDate[1]}`;
            }
            if (newDate[2].toString().length === 1) {
                newDate[2] = `0${newDate[2]}`;
            }
            mapDate = newDate.join('');
        }
        mapDate = mapDate.replace(/[-/ :]/g, '');
        if (mapDate.length >= 14) {
            mapDate = new Date(
                mapDate.substr(0, 4),
                mapDate.substr(4, 2) - 1,
                mapDate.substr(6, 2),
                mapDate.substr(8, 2),
                mapDate.substr(10, 2),
                mapDate.substr(12, 2)
            );
        } else if (mapDate.length >= 12) {
            mapDate = new Date(
                mapDate.substr(0, 4),
                mapDate.substr(4, 2) - 1,
                mapDate.substr(6, 2),
                mapDate.substr(8, 2),
                mapDate.substr(10, 2)
            );
        } else if (date.length >= 10) {
            mapDate = new Date(
                mapDate.substr(0, 4),
                mapDate.substr(4, 2) - 1,
                mapDate.substr(6, 2),
                mapDate.substr(8, 2)
            );
        } else {
            mapDate = new Date(mapDate.substr(0, 4), mapDate.substr(4, 2) - 1, mapDate.substr(6, 2));
        }
    } else {
        mapDate = new Date(mapDate);
    }
    const map = {
        M: mapDate.getMonth() + 1, // 月份
        d: mapDate.getDate(), // 日
        h: mapDate.getHours(), // 小时
        m: mapDate.getMinutes(), // 分
        s: mapDate.getSeconds(), // 秒
        q: Math.floor((mapDate.getMonth() + 3) / 3), // 季度
        S: mapDate.getMilliseconds() // 毫秒
    };

    const mapFormat = format.replace(/([yMdhmsqS])+/g, (all, t) => {
        let v = map[t];

        if (v) {
            if (all.length > 1) {
                v = `0${v}`;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return `${mapDate.getFullYear()}`.substr(4 - all.length);
        }
        return all;
    });

    return mapFormat;
};


// JSON格式化
export function formatJson(obj, opt) {
    let reg = null,
        formatted = '',
        pad = 0;
    const PADDING = '    '; // one can also use '\t' or a different number of spaces

    // optional settings
    const options = opt || {};
    let json = obj;

    // remove newline where '{' or '[' follows ':'
    options.newlineAfterColonIfBeforeBraceOrBracket = options.newlineAfterColonIfBeforeBraceOrBracket === true;
    // use a space after a colon
    options.spaceAfterColon = options.spaceAfterColon !== false;

    // begin formatting...
    try {
        // make sure we start with the JSON as a string
        if (typeof json !== 'string') {
            json = JSON.stringify(json);
        }
        // parse and stringify in order to remove extra whitespace
        // json = JSON.stringify(JSON.parse(json));可以除去多余的空格
        json = JSON.parse(json);
        json = JSON.stringify(json);

        /* eslint-disable no-useless-escape */
        // add newline before and after curly braces
        reg = /([\{\}])/g;
        json = json.replace(reg, '\r\n$1\r\n');

        // add newline before and after square brackets
        reg = /([\[\]])/g;
        json = json.replace(reg, '\r\n$1\r\n');

        // add newline after comma
        reg = /(\,)/g;
        json = json.replace(reg, '$1\r\n');

        // remove multiple newlines
        reg = /(\r\n\r\n)/g;
        json = json.replace(reg, '\r\n');

        // remove newlines before commas
        reg = /\r\n\,/g;
        json = json.replace(reg, ',');

        // optional formatting...
        if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
            reg = /\:\r\n\{/g;
            json = json.replace(reg, ':{');

            reg = /\:\r\n\[/g;
            json = json.replace(reg, ':[');
        }
        if (options.spaceAfterColon) {
            reg = /\:/g;
            json = json.replace(reg, ': ');
        }

        json.split('\r\n').forEach(node => {
            let i = 0,
                indent = 0,
                padding = '';

            if (node.match(/\{$/) || node.match(/\[$/)) {
                indent = 1;
            } else if (node.match(/\}/) || node.match(/\]/)) {
                if (pad !== 0) {
                    pad -= 1;
                }
            } else {
                indent = 0;
            }

            for (i = 0; i < pad; i++) {
                padding += PADDING;
            }

            formatted += `${padding + node}\r\n`;
            pad += indent;
        });
        /* eslint-enable no-useless-escape */

        // NOTE: 去掉首行换行
        return formatted.replace(/\r\n/, '');
    } catch (e) {
        return new Error('请输入合法的 JSON 字符串');
    }
}

// JS判断字符串是否为json数据
export function isJsonString(str) {

    try {
        if (typeof JSON.parse(str) === 'object') {
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
    return false;
}

// 分享到指定网站
export function shareTo(type, title, summary) {
    const shareTitle = `${title}-厦门市大数据安全开放平台`; // 标题
    const imgUrl = 'http://data.xm.gov.cn/images/header_logo.png';

    if (type === 'qq') {
        window.open(`http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(document.location.href)}&sharesource=qzone&title=${shareTitle}&pics=${imgUrl}&summary=${summary}`);
    }
    if (type === 'weibo') {
        window.open(`http://v.t.sina.com.cn/share/share.php?title=${shareTitle}&url=${encodeURIComponent(document.location.href)}&content=utf-8&sourceUrl=&pic=`);
    }
    if (type === 'qqZone') {
        window.open(`https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(window.location.href)}&sharesource=qzone&title=${shareTitle}&pics=${imgUrl}&summary=${summary}&desc=`);
    }
    // if (type === 'wechat') {
    //     window.open(`http://zixuephp.net/inc/qrcode_img.php?url=${encodeURIComponent(window.location.href)}`);
    // }
}

/**
 * 反转译HTML字符串
 * @param {string} html 待转化的html字符串
 * @return {string}
 */
export function htmlEscape(html){
    if (typeof html !== 'string') return;
    const reg = /(&lt;)|(&gt;)|(&amp;)|(&quot;)/g;

    return html.replace(reg, match => {
        switch (match){
        case '&lt;':
            return '<';
        case '&gt;':
            return '>';
        case '&amp;':
            return '&';
        case '&quot;':
            return '"';
        default:
        }
    });
}


/**
 * 生成md目录
 * @param {string} container 生成目录的容器
 * @param {string} containerWidth 容器的总宽度
 * @param {string} addSNToTitle 是否给标题自动增加序号
 * @return {string}
 */
/* eslint-disable */
export function mdNav(container, containerWidth, addSNToTitle){
    const h1s = $(container).find('h1');
    const h2s = $(container).find('h2');
    const h3s = $(container).find('h3');
    const h4s = $(container).find('h4');
    const h5s = $(container).find('h5');
    const h6s = $(container).find('h6');

    const headCounts = [h1s.length, h2s.length, h3s.length, h4s.length, h5s.length, h6s.length];

    /* 导航只展示两级标题*/
    let vH1Tag = null;
    let vH2Tag = null;

    for (let i = 0; i < headCounts.length; i++){
        if (headCounts[i] > 0){
            if (vH1Tag == null){
                vH1Tag = `h${i + 1}`;
            } else if (vH2Tag == null){
                vH2Tag = `h${i + 1}`;
                break;
            }
        }
    }
    if (vH1Tag == null){
        return;
    }
    if ($('.BlogAnchor').length !== 0){
        $('.BlogAnchor').remove();
    }
    $(container).append('<div class="BlogAnchor">' +
            '<p class="anchorToggle"><i class="si si-com_currentitem2 hideBtn"></i></p>' +
            '<ul class="AnchorContent" id="AnchorContent"> </ul>' +
            '</div>');

    let vH1Index = 0;
    let vH2Index = 0;

    $(container).find(vH1Tag + (vH2Tag != null ? (`,${vH2Tag}`) : ''))
        .each((i, item) => {
            let id = '';
            let name = '';
            const tag = $(item).get(0).tagName.toLowerCase();
            let className = '';

            if (tag === vH1Tag){
                id = ++vH1Index;
                name = id;
                vH2Index = 0;
                className = 'item_h1';
            } else if (tag == vH2Tag){
                id = `${vH1Index}_${++vH2Index}`;
                name = `${vH1Index}.${vH2Index}`;
                className = 'item_h2';
            }
            $(item).attr('id', `wow${id}`);
            $(item).addClass('wow_head');
            const originText = $(item).text();
            let navText = originText;

            if (addSNToTitle){
                $(item).text(`${name}. ${originText}`);
                navText = `${name}. ${originText}`;
            }
            $('#AnchorContent').css('max-height', `${$(window).height() - 180}px`);
            if (i === 0){
                $('#AnchorContent').append(`<li class="current"><p><a 
                    class="nav_item ${className} anchor-link" 
                    onclick="return false;" 
                    href="#" 
                    link="#wow${id}"
                    title=${navText}
                    >${navText}</a></p></li>`);
            } else {
                $('#AnchorContent').append(`<li><p><a 
                    class="nav_item ${className} anchor-link" 
                    onclick="return false;" 
                    href="#" 
                    link="#wow${id}"
                    title=${navText}
                    >${navText}</a></p></li>`);
            }
        });

    $('.anchor-link').click(function(){
        $('html,body').animate({ scrollTop: $($(this).attr('link')).offset().top }, 500);
    });

    $('.anchorToggle').on('click', '.hideBtn', function(){
        $('.AnchorContent').hide();
        $(this).removeClass()
            .addClass('si si-com_currentitem showBtn');
    });
    $('.anchorToggle').on('click', '.showBtn', function(){
        $('.AnchorContent').show();
        $(this).removeClass()
            .addClass('si si-com_currentitem2 hideBtn');
    });

    const headerNavs = $('.BlogAnchor li');
    const headerTops = [];

    $('.wow_head').each(function(i, n){
        headerTops.push($(n).offset().top);
    });
    $(window).scroll(function(){
        const scrollTop = $(window).scrollTop();

        $.each(headerTops, function(i, n){
            const distance = n - scrollTop;

            if (distance >= 0){
                $('.BlogAnchor li.current').removeClass('current');
                $(headerNavs[i]).addClass('current');
                return false;
            }
        });
    });
    // 设置菜单的位置
    const bodyWidth = $('body').width();
    const right = bodyWidth > containerWidth ? (bodyWidth - containerWidth) / 2 - 20 : 20;

    $('.BlogAnchor').css('right', `${right}px`);
}

/**
 * 获取文件名不带后缀
 * @param {string} filePath 文件路径
 * @return {string}
 */
export function getFileName(filePath){
    return filePath.replace(/(.*\/)*([^.]+).*/ig, '$2');
}
