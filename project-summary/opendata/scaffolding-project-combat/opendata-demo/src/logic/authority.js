/*
 * @(#) authority.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2019-12-20 11:14:09
 */

import React, { Fragment, useCallback } from 'react';
import { getUser } from '@/services/common';
import { DOMAIN_NAME, GRADE } from '@/config/status';
import { useUserInfo } from '@/logic/dva';
import { jumpToLogin } from '@/utils';

/**
 * 获得检测操作权限的方法
 * @returns {checkAuthority}
 */
export function useCheckAuthority () {
    const userInfo = useUserInfo();

    /**
     * 检测操作权限
     * @callback checkAuthority
     * @param {GRADE} [grade=GRADE.PERSONAL]    该操作的权限级别，默认为个人账户级别，级别顺序：游客 < 个人 < 企业 < 合作伙伴
     * @param {boolean} [strictCheck]            是否启用严格权限校验，即校验前调用getUser获取当前状态的用户信息，防止登录过期
     * @param {boolean} [disabledAlert]         是否禁用提示框
     */
    return useCallback(async (grade = GRADE.PERSONAL, strictCheck, customTip) => {
        let currUserInfo = null;

        if (strictCheck) {
            try {
                currUserInfo = await getUser();
            } catch (e) {
                currUserInfo = null;
            }
        } else {
            currUserInfo = userInfo;
        }
        return await new Promise((resolve, reject) => {
            /* eslint-disable brace-style */
            let errorMsg = '';

            // 【游客】级别以上权限页面没有登录
            if (grade !== GRADE.VISITOR && !currUserInfo) {
                errorMsg = <Fragment>您当前未登录，请先<a onClick={() => jumpToLogin()}>登录</a></Fragment>;
            }

            // 【生态合作伙伴】权限页面使用非生态合作伙伴帐号
            else if (grade === GRADE.PARTNER && !currUserInfo.isPartner) {
                errorMsg = '您当前非生态合作伙伴，请先加入生态合作伙伴并登录后再进行申请';
            }

            // (【企业】或【生态合作伙伴】)权限页面使用非企业帐号
            else if ([GRADE.ENTERPRISE, GRADE.PARTNER].includes(grade) && currUserInfo.domainName !== DOMAIN_NAME.QY) {
                errorMsg = '您当前非企业实名认证用户，请先完成企业实名认证并登录后再进行申请';
            }

            if (errorMsg) {
                !customTip && alert(errorMsg);
                reject(new Error(errorMsg));
            } else {
                resolve();
            }
        });
    }, [userInfo]);
}
