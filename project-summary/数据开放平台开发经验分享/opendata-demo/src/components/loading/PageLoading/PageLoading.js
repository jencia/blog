/*
 * @(#) PageLoading.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2019-12-10 00:41:27
 */

import React from 'react';
import { Spin } from 'antd';

// 页面白屏时显示的loading，高度356是为了跟html的loading保持一致位置
const PageLoading = () => (
    <Spin size="large">
        <div style={{ height: 356 }} />
    </Spin>
);

export default PageLoading;
