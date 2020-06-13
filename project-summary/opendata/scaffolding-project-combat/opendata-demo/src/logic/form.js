/*
 * @(#) form.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2019-12-09 16:46:56
 */

import { useState } from 'react';
import { useMount, useUpdate } from 'react-use';
import { FormState } from '@share/shareui-form';

export const useFormState = (initData = {}) => {
    const [formState, setFormState] = useState(null);
    const update = useUpdate();

    useMount(async () => {
        const response = typeof initData === 'function' ? await initData() : { ...initData };
        const _formState = new FormState(response, nextState => {
            setFormState(nextState);
            update();
        });

        setFormState(_formState);
    });

    return formState;
};
