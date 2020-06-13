/*
 * @(#) utils.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2019-12-23 17:16:33
 */

import { useMemo, useCallback, useState } from 'react';
import { getUrlSearch } from '@/utils';

/**
 * 用于状态切换形式的相关字段
 * @param {*} initValue 初始值
 * @return {[*, function, function]} [状态值, 切换方法, 状态设置方法]
 */
export function useToggleState (initValue) {
    const [value, setValue] = useState(initValue);
    const toggleFn = useCallback(
        () => setValue(!value),
        [value]
    );

    return [value, toggleFn, setValue];
}

/**
 * 传入一个返回值为Promise的函数，返回一个专属loading值
 * @param {function: Promise} method Promise函数
 * @return {[bool, function: Promise]}
 */
export function useLoading (method) {
    const [loading, setLoading] = useState(false);
    const methodWrap = useCallback(request => {
        setLoading(true);

        return method(request)
            .finally(() => setLoading(false));
    }, [method]);

    return [loading, methodWrap];
}

export function useUrlSearch () {
    return useMemo(getUrlSearch, []);
}
