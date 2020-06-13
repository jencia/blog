/*
 * @(#) network.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2019-09-06 16:05:24
 */

import { message } from 'antd';
import specialStatus from '@/config/specialStatus';
import request from '@/utils/request';
import { EXTRA_REQUEST_PARAMS } from '@/config/service';

const network = {};

/**
 * 对request的二次封装
 * 主要做错误捕捉与响应状态处理
 * 不使用network()的方式，而是network.send()，是因为如果存在network()方法就无法正确显示注释文档
 * @param {Array} params                     参考request的args用法
 * @param {boolean} [closeErrorHandle=false] 是否关闭内置异常处理，为true代表关闭，则需要自行捕捉异常处理
 * @return {Promise}
 */
network.send = function networkSend(params, closeErrorHandle) {
    return request(...params).catch(error => {
        // 规则与提示语的映射
        const mapRuleToMsg = [
            ['stack' in error, '系统内部异常'], // 前端代码错误
            ['errcode' in error, error.errmsg], // 使用mock数据时，yapi返回的错误
            [error.requestFail || error.requestError, error.message] // 接口返回状态码非1200的数据
        ];
        const errorMessage = mapRuleToMsg.reduce((rs, [rule, msg]) => rs || (rule && msg), '') || '未知错误';
        const specialHandle = specialStatus[error.status];

        error.originMessage = error.message;
        error.message = errorMessage;

        if (!closeErrorHandle) {
            // 如果状态码存在于特殊状态码里，就执行相应的处理方法
            specialHandle ? specialHandle(error) : message.error(errorMessage);
        }
        throw error;
    });
};

/**
 * get请求
 * @param {string} url                       请求地址
 * @param {Object} [params]                  请求参数，如果值传的不是对象就作为mock值
 * @param {Object|boolean} [optionOrMock]    类型为对象时代表请求选项，参数值与request一样，类型为布尔值时代表是否使用mock请求
 * @param {boolean} [closeErrorHandle=fa;se] 是否关闭内置异常处理，为true代表关闭，则需要自行捕捉异常处理
 * @return {Promise}
 */
network.get = function networkGet(url, params, optionOrMock, closeErrorHandle) {
    if (typeof params !== 'object') {
        return network.send([url, params], closeErrorHandle);
    }
    const paramObj = {
        ...(params || {}),
        ...EXTRA_REQUEST_PARAMS
    };
    let paramStr = '';

    // { a: 1, b: 2 } => ?a=1&b=2
    if (Object.keys(paramObj).length) {
        paramStr = Object.entries(paramObj)
            .filter(([, name]) => name)
            .reduce((rs, [key, name], index) => {
                const prefix = index > 0 ? '&' : '?';

                return `${rs + prefix + encodeURIComponent(key)}=${encodeURIComponent(name)}`;
            }, '');
    }

    return network.send([url + paramStr, optionOrMock], closeErrorHandle);
};

/**
 * post请求
 * @param {string} url                       请求地址
 * @param {Object} [body]                    请求参数
 * @param {Object|boolean} [optionOrMock]    类型为对象时代表请求选项，参数值与request一样，类型为布尔值时代表是否使用mock请求
 * @param {boolean} [closeErrorHandle=false] 是否关闭内置异常处理，为true代表关闭，则需要自行捕捉异常处理
 * @return {Promise}
 */
network.post = function networkPost(url, body, optionOrMock, closeErrorHandle) {
    const newOption = {
        body: {
            ...(body || {}),
            ...EXTRA_REQUEST_PARAMS
        },
        ...(optionOrMock === 'object' ? optionOrMock : {}),
        method: 'POST'
    };

    const mock = optionOrMock === 'object' ? false : optionOrMock;

    return network.send([url, newOption, mock], closeErrorHandle);
};

export default network;
