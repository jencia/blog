import styles from './BasicFooter.scss';
import React from 'react';
import footerLogo from '@/assets/images/layouts/img_footer_logo.png';

const BasicFooter = () => (
    <footer className={styles.basicFooter}>
        <div className={styles.wrapper}>
            <ul>
                <li>
                    <a href="/opendata/partner/">生态合作</a>
                </li>
                {/*
                <li>
                    <a href="/hdjl/">互动交流</a>
                </li>*/}
                <li>
                    <a
                        href="https://www.ixm.gov.cn/common/zczy/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        注册指引
                    </a>
                </li>
                <li>
                    <a
                        href="/opendata/doc/index.html"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        文档中心
                    </a>
                </li>
                <li>
                    <a href="/opendata/other/#/contact_us">联系我们</a>
                </li>
                <li>
                    <a href="/opendata/other/#/legal_notice">法律条款</a>
                </li>
            </ul>
            <p>
                <span>主办：厦门市工业和信息化局　</span>
                <span>运行管理：厦门市信息中心　</span>
                <a
                    href="http://beian.miit.gov.cn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    闽ICP备06004296-49号
                </a>
                <span className={styles.emailXs}>　服务咨询邮箱：xmdata@xm.gov.cn</span>
            </p>
            <p className={styles.mail}>服务咨询邮箱：xmdata@xm.gov.cn{/* （建议使用1280×768以上分辨率IE10.0以上版本浏览器）*/}</p>
            <img src={footerLogo} alt="footer_logo" />
        </div>
    </footer>
);

export default BasicFooter;
