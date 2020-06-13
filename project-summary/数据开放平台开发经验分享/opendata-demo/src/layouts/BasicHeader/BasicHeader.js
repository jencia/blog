/*
 * @(#) Header.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2019-12-05 09:39:34
 */

import styles from './BasicHeader.scss';
import React, { Fragment, useMemo, useState } from 'react';
import { Label } from '@share/shareui';
import { COMMON_API_PREFIX } from '@/config/service';
import { DOMAIN_NAME } from '@/config/status';
import cx from 'classnames';
import { jumpToLogin } from '@/utils';
import { useUserInfo } from '@/logic/dva';
import headerLogo from '@/assets/images/layouts/icon_header_logo.png';

const menuList = [
    {
        name: '开放主题',
        href: '/opendata/open-theme/',
        // children: [
        //     { name: '信用服务', href: '/kfzt/xyfw/' },
        //     { name: '医疗卫生', href: '/kfzt/yljk/' },
        //     { name: '交通运输', href: '/kfzt/jtys/' },
        //     { name: '旅游出行', href: '/kfzt/lycx/' },
        //     { name: '公共安全', href: '/kfzt/ggaq/' }
        // ]
    },
    { name: '数据目录', href: '/opendata/datas/' },
    { name: '空间视窗', href: '/opendata/map/' },
    { name: '算法模型', href: '/opendata/algorithm-model/' },
    { name: '应用中心', href: '/opendata/apps/' },
    { name: '开放指数', href: '/opendata-stat/', blank: true },
    { name: '应用场景', href: '/opendata/case/' },
    { name: '生态合作', href: '/opendata/partner/' },
    { name: '开发者中心', href: '/opendata/developer/' }
];

const BasicHeader = () => {
    const [userInfo, logon] = useUserInfo(true);
    const { pathname } = location;
    const [showSubmenu, setShowSubmenu] = useState(-1);
    const username = useMemo(() => (
        !userInfo ? '' :
            userInfo.domainName === DOMAIN_NAME.QY ?
                userInfo.groupDisplayName :
                userInfo.trueName
    ), [userInfo]);

    return (
        <header className={styles.basicHeader}>
            <div className={styles.logo}>
                <a href="/opendata/">
                    <div className={styles.desc}>
                        <img src={headerLogo} alt="footer_logo" />
                        <span>厦门市大数据安全开放平台</span>
                    </div>
                </a>
            </div>
            <ul className={styles.menuList}>
                {menuList.map(({ name, href, blank, children = [] }, index) => (
                    <li
                        className={styles.menuItem}
                        key={index}
                        onMouseEnter={() => setShowSubmenu(index)}
                        onMouseLeave={() => setShowSubmenu(-1)}
                    >
                        <a
                            href={href}
                            target={blank ? '_blank' : '_self'}
                            className={cx({
                                [styles.active]: pathname === href || children.some(v => pathname === v.href)
                            })}
                        >
                            {name}
                        </a>
                        {children.length > 0 && (
                            <ul
                                className={styles.secondMenuList}
                                style={showSubmenu === index ? { display: 'block' } : {}}
                            >
                                {children.map((el, ind) => (
                                    <li className={styles.secondMenuItem} key={ind}>
                                        <a
                                            href={el.href}
                                            className={cx({ [styles.active]: pathname === href })}
                                            target={el.blank ? '_blank' : '_self'}
                                        >
                                            {el.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
            {/* 登录中的时候不展示用户信息 */}
            {!logon && (
                <div className={styles.user}>
                    <ul>
                        <li id="user">
                            {userInfo ?
                                <Fragment>
                                    <div className={styles.name} title={username}>
                                        {username}
                                    </div>
                                    <Label className={userInfo.isPartner ? 'partner' : 'normal'}>
                                        {userInfo.isPartner ? '生态合作' : '实名认证'}
                                    </Label>
                                </Fragment> :
                                <a onClick={() => jumpToLogin()}>登录</a>
                            }
                        </li>
                        <li id="login">
                            {userInfo ?
                                <a href={`${COMMON_API_PREFIX}/logout.do`}>注销</a> :
                                <a
                                    href="https://passport.ixm.gov.cn/#/register"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    注册
                                </a>
                            }
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
};

export default BasicHeader;
