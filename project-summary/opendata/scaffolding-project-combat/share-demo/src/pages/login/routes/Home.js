import React from 'react';
import  '@share/login/lib/index.css';
import logoPic from '../../../assets/images/zeus_logo.png';
import { LoginPage } from '@share/login';
const props = {
    loginPageProps: {
        titles: ['畅享管理系统平台', 'ShareUI v2.0.0'],
        logoPic,
        guilds: [
            { text: '了解我们', href: 'http://www.baidu.com' },
            { text: '新手指南' },
            { text: '帮助手册' },
            { text: '更新日志' },
            { text: '快速入门' },
        ],
        copyright: ['Copyright © 2011-2017', '畅享信息技术有限公司'],
    },
    changePwdProps: {
        pwdLevel: 2// 修改密码校验等级
    }
};
const Home = () => {
    return <LoginPage {...props} />;
};

export default Home;
