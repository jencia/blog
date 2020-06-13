/*
 * @(#) common.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author ll
 * 2019-09-10 14:05:21
 */

import network from '@/utils/network';
const MOCK = true;

/**
 * 获取表码
 * YApi地址：http://192.168.0.62:3000/project/218/interface/api/35308
 * @returns {Promise}
 */
export function getDictionaries(data) {
    return network.post('/common/getDictionaries', data, MOCK);
}

/**
 * 获取当前登录用户
 * YApi地址：http://192.168.0.62:3000/project/218/interface/api/29825
 * @return {Promise}
 */
export function getUser() {
    return network.get('/user/getUser', MOCK);
}

/**
 * 模拟登陆
 * YApi地址：http://192.168.0.62:3000/project/218/interface/api/35250
 * @return {Promise}
 */
export function mockUser(data) {
    return network.post('/user/mockUser', data, MOCK);
}
