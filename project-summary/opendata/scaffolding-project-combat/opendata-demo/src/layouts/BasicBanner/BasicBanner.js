import styles from './BasicBanner.scss';
import React, { useCallback } from 'react';
import { Button } from 'antd';
import cx from 'classnames';
import { useCheckAuthority } from '@/logic/authority';
import publicBanner from '@/assets/images/layouts/img_basic-banner.png';

const BasicBanner = ({ title, description, imgUrl = publicBanner, buttons }) => {
    const checkAuthority = useCheckAuthority();

    const handleBtnClick = useCallback(({ grade, url }) => {
        if (grade) {
            checkAuthority(grade).then(() => {
                location.href = url;
            });
        } else {
            location.href = url;
        }
    }, [checkAuthority]);

    return (
        <div className={cx(styles.basicBanner, { [styles.large]: !!buttons })}>
            <img src={imgUrl} alt="banner_bg" />
            <div className={styles.bannerContent}>
                <h1 className={styles.title}>{title || ''}</h1>
                <p className={styles.description}>{description || ''}</p>
                {!!buttons && (
                    <div className={styles.buttons}>
                        {buttons.map((v, i) => (
                            <a key={i} onClick={() => handleBtnClick(v)}>
                                <Button ghost>{v.text}</Button>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BasicBanner;
