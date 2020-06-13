/*
 * @(#) InternalServerError.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2020
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2020-01-06 22:16:23
 */

import styles from './InternalServerError.scss';
import React from 'react';
import img500 from '@/assets/images/img_500.png';

const InternalServerError = () => (
    <div className={styles.internalServerError}>
        <div className={styles.wrapper}>
            <img src={img500} alt="500" />
            <div>
                <h1>500</h1>
                {/* <p>抱歉，服务器出错了</p>*/}
                <p>访问异常，请检查您的网络</p>
            </div>
        </div>
    </div>
);

export default InternalServerError;
