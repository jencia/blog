/*
 * @(#) NoFound.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2019-12-05 10:12:53
 */

import styles from './NoFound.scss';
import React from 'react';
import img404 from '@/assets/images/img_404.png';

const NoFound = () => (
    <div className={styles.noFound}>
        <div className={styles.wrapper}>
            <img src={img404} alt="404" />
            <div>
                <h1>404</h1>
                <p>抱歉，您访问的页面不存在</p>
            </div>
        </div>
    </div>
);

export default NoFound;
