/*
 * @(#) AuthFail.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2019-12-20 00:38:10
 */

import styles from './AuthFail.scss';
import React from 'react';
import { useHistory } from 'react-router';
import { Button } from '@share/shareui';
import img403 from '@/assets/images/img_403.png';

const AuthFail = ({ reason }) => {
    const history = useHistory();

    return (
        <div className={styles.authFail}>
            <div className={styles.wrapper}>
                <img src={img403} alt="403" />
                <div>
                    <h1>抱歉，您无权访问页面！</h1>
                    <p>原因：{reason || '未知'}</p>
                    <Button bsSize="large" onClick={history.goBack}>返回</Button>
                </div>
            </div>
        </div>
    );
};

export default AuthFail;
