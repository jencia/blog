/*
 * @(#) BasicLayout.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2019-12-05 09:22:04
 */

import styles from './BasicLayout.scss';
import React, { useMemo } from 'react';
import BasicHeader from '@/layouts/BasicHeader';
import BasicBanner from '@/layouts/BasicBanner';
import BasicFooter from '@/layouts/BasicFooter';
import PageLoading from '@/components/loading/PageLoading';
import AuthFail from './components/AuthFail';
import { GRADE, DOMAIN_NAME } from '@/config/status';
import cx from 'classnames';
import { jumpToLogin } from '@/utils';
import { useGetUserList, useUserInfo } from '@/logic/dva';
import noLoginImg from '@/assets/images/icon_nologin.png';

const BasicLayout = props => {
    const {
        grade,
        title, description, bannerButtons,
        className, topClassName, style, topStyle,
        isCustomContainer, isCustomLayout, children
    } = props;
    const [userInfo, logon] = useUserInfo(true);
    const content = useMemo(() => {
        if (logon) return '';

        // 【游客】权限页面不需要登录，【其他】都需要登录
        if (grade === GRADE.VISITOR) {
            return children;
        } else if (!userInfo) {
            return (
                <div className={styles.noLogin}>
                    <img src={noLoginImg} alt="no login" />
                    您当前未登录系统，请<a onClick={() => jumpToLogin()}>登录</a>
                </div>
            );
        }
        return children;
    }, [logon, grade, userInfo, children]);

    // 获取用户信息
    useGetUserList();

    // 登录中时整个页面处于加载中状态
    if (logon) {
        return <PageLoading />;
    }
    if (userInfo) {
        // 【生态合作伙伴】权限页面使用非生态合作伙伴帐号
        if (grade === GRADE.PARTNER && !userInfo.isPartner) {
            return <AuthFail reason="您当前非生态合作伙伴，无权访问本页面" />;
        }
        // (【企业】或【生态合作伙伴】)权限页面使用非企业帐号
        if ([GRADE.ENTERPRISE, GRADE.PARTNER].includes(grade) && userInfo.domainName !== DOMAIN_NAME.QY) {
            return <AuthFail reason="您当前非企业实名认证用户，无权访问本页面" />;
        }
    }
    if (isCustomLayout) {
        return content;
    }

    return (
        <div className={cx(styles.basicLayout, topClassName)} style={topStyle}>
            <BasicHeader />
            <BasicBanner title={title} description={description} buttons={bannerButtons} />
            {isCustomContainer ?
                content :
                <div className={cx(styles.basicContent, className)} style={style}>
                    {content}
                </div>
            }
            <BasicFooter />
        </div>
    );
};

BasicLayout.defaultProps = {
    title: '',
    description: '',
    grade: GRADE.VISITOR
};

export default BasicLayout;
