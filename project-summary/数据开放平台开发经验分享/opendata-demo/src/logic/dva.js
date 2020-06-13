/*
 * @(#) dva.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2019-12-09 10:36:15
 */

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

/**
 * 获取表码数据
 * @param {string|string[]} [code]      指定一个或多个code去请求数据
 * @param {boolean} [isGetMoreParams]   是否返回更多参数
 * @return {Object|[Object,boolean]}    isGetMoreParams为false时返回bmList，为true时返回[bmList，loading]
 */
export function useBmList (code, isGetMoreParams) {
    const dispatch = useDispatch();
    const bmCode = (Array.isArray(code) ? code : [code || '']).filter(v => v);
    const { bmList, loading } = useSelector(state => ({
        bmList: state.bm.bmList,
        loading: state.loading.models.bm
    }));

    useEffect(() => {
        if (bmCode.length > 0) {
            dispatch({
                type: 'bm/getBmList',
                code
            });
        }
    }, []); /* eslint-disable-line */

    if (isGetMoreParams) {
        return [bmList, loading];
    }
    return bmList;
}

/**
 * 获取用户信息数据
 * @return {Object|[Object,boolean]}   isGetMoreParams为false时返回用户信息值，为true时返回[用户信息值, 是否正在登录]
 */
export function useUserInfo (isGetMoreParams) {
    const { userInfo, logon } = useSelector(({ user }) => user);

    if (isGetMoreParams) {
        return [userInfo, logon];
    }
    return userInfo;
}

/**
 * 请求用户信息数据
 * @param {boolean} [flag=true]    是否发起请求
 */
export function useGetUserList (flag = true) {
    const dispatch = useDispatch();

    useEffect(() => {
        flag && dispatch({ type: 'user/getUserInfo' });
    }, [dispatch, flag]);
}
