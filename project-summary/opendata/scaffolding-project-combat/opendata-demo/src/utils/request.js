import fetch from 'dva/fetch';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { __MOCK__, COMMON_API_PREFIX, MOCK_API_PREFIX } from '@/config/service';

/**
 * 请求状态监测
 * 响应状态为200到300之间的就认定为请求成功，走then；否则请求失败，提示错误，走catch
 * @param {Response} response   fetch请求的响应值
 * @return {*}
 */
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) return response;

    const error = {
        status: response.status,
        data: null,
        message: `请求错误 ${response.status}: ${response.statusText}`,
        errorDetail: response
    };

    error.requestFail = true;
    throw error;
}

/**
 * 参数格式化
 * @param args  参考底下request方法的说明
 * @return {{ url: String, options: Object }}
 */
function formatArgs(...args) {
    // 当参数只有两个且第二个参数是对象时，push一个第三个参数，false代表不使用mock
    if (args.length === 2 && typeof args[1] === 'object') {
        args.push(false);
    }
    // 当参数大于一个时，去除最后一个参数作为mock值，剩下的作为requestParams值；否则所有参数作为requestParams值
    const requestParams = args.length > 1 ? args.slice(0, args.length - 1) : args;
    let [url, options = {}] = requestParams; // eslint-disable-line
    const [mock] = args.length > 1 ? args.slice(-1) : [false];

    // 全局开启后mock参数才有效，才可以使用mock请求
    if (__MOCK__) {
        const API_PREFIX = mock ? MOCK_API_PREFIX : COMMON_API_PREFIX;

        url = API_PREFIX + url;
        // 如果想返回不同期望的mock数据，则request最后一个参数传入类型为string的状态值
        if (typeof mock === 'string') {
            url += `?mockStatus=${mock}`;
        }
    } else {
        url = COMMON_API_PREFIX + url;
    }

    return { url, options };
}

/**
 * 对dva/fetch进行二次封装
 *
 * @param {Array} args
 *   一个参数时：url
 *   两个参数时
 *     第二个参数是对象：url、option、mock
 *     第二个参数不是对象：url、mock
 *   三个参数时：url、option、mock
 * @param {string} args - url     请求地址
 * @param {Object} args - option  请求参数，参数格式跟fetch一样
 * @param {boolean} args - mock   是否使用mock请求
 * @return {Promise}            返回响应后的Promise
 */
export default async function request(...args) {
    const { url, options } = formatArgs(...args);
    const defaultOptions = {
        credentials: 'include'
    };
    const newOptions = { ...defaultOptions, ...options };

    if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
        newOptions.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            ...newOptions.headers
        };
        newOptions.body = JSON.stringify(newOptions.body);
    }

    let res = Promise.resolve({});

    NProgress.start();
    try {
        res = await fetch(url, newOptions)
            .then(checkStatus)
            .then(response => response.json())
            .then(response => {
                if (response.status === '1200') {
                    return response.data;
                }
                response.requestError = true;
                throw response;
            });
    } finally {
        NProgress.done();
    }
    return res;
}
