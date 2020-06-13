/*
 * @(#) user.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2019-12-05 15:44:34
 */

import { getUser } from '@/services/common';

export default {
    namespace: 'user',

    state: {
        userInfo: null,
        logon: true
    },

    reducers: {
        setUserInfo: (state, { payload }) => ({ ...state, userInfo: payload }),
        setLogon: (state, { payload }) => ({ ...state, logon: payload })
    },

    effects: {
        *getUserInfo(action, { call, put }) {
            yield put({ type: 'setLoading', payload: true });
            try {
                const userInfo = yield call(getUser);

                yield put({ type: 'setUserInfo', payload: userInfo });
            } catch (e) {
                yield put({ type: 'setUserInfo', payload: null });
            } finally {
                yield put({ type: 'setLogon', payload: false });
            }
        }
    }
};
