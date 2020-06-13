/*
 * @(#) bm.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2019-09-11 14:43:06
 */

import { getDictionaries } from '@/services/common';

export default {
    namespace: 'bm',

    state: {
        bmList: {}
    },

    reducers: {
        setBmList: (state, { payload }) => ({ ...state, bmList: payload })
    },

    effects: {
        *getBmList({ code }, { select, call, put }) {
            const codes = typeof code === 'string' ? [code] :
                Array.isArray(code) ? code : [];
            const { bmList } = yield select(({ bm }) => bm);
            const filteredCodes = codes.filter(v => !bmList[v]);    // 过滤掉原本存在的表码
            let newBm = null;

            if (filteredCodes.length) {
                try {
                    newBm = yield call(getDictionaries, { codes });
                } catch (e) {} // eslint-disable-line
            }

            if (newBm) {
                newBm = Object.entries(newBm).reduce((rs, [key, value]) => {
                    rs[key] = (value || []).map(v => ({
                        ...v,
                        label: v.name,
                        value: v.code
                    }));
                    return rs;
                }, {});
                const { bmList: currentBm } = yield select(({ bm }) => bm);

                yield put({
                    type: 'setBmList',
                    payload: {
                        ...currentBm,
                        ...newBm
                    }
                });
            }
        }
    }
};
