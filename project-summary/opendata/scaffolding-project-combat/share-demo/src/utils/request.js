import fetch from 'dva/fetch';
import { notification } from 'antd';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { __MOCK__, COMMON_API_PREFIX, MOCK_API_PREFIX } from '../config/service';

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) return response;

    notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: response.statusText || '没有返回相关的错误描述'
    });
    const error = new Error(response.statusText);

    error.response = response;
    throw error;
}

function formatArgs(...args) {
    if (args.length === 2 && typeof args[1] === 'object') {
        args.push(false);
    }
    const requestParams = args.length > 1 ? args.slice(0, args.length - 1) : args;
    let [url, options = {}] = requestParams; // eslint-disable-line
    const [mock] = args.length > 1 ? args.slice(-1) : [false];

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
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(...args) {
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

    /**
     * 这边前后端约束，如果接口请求失败，则返回
     * {
     *   code: 10001,
     *   name: '校验错误',
     *   message: 'please input password',
     * }
     */
    NProgress.start();
    return fetch(url, newOptions)
        .then(checkStatus)
        .then(response => response.json())
        .then(response => {
            NProgress.done();
            if(response.status === '1200'  && response.data){
                return response.data;
            }
            return response;
        })
        .catch(error => {
            if (error.code) {
                notification.error({
                    message: error.name,
                    description: error.message
                });
            }

            if ('stack' in error && 'message' in error) {
                notification.error({
                    message: `请求错误: ${url}`,
                    description: error.message
                });
            }
            NProgress.done();
            throw error;
        });
}
