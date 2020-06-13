import React from 'react';

import styles from './Home.less';

const NotFound = () => {
    return (
        <div className={styles.body}>
            <div className={styles['code-area']}>
                <span style={{ color: '#777', fontStyle: 'italic' }}>// 404 page not found.</span>
                <span>
                    <span style={{ color: '#d65562' }}>if</span>
                    (<span style={{ color: '#4ca8ef' }}>!</span>
                    <span style={{ color: '#bdbdbd', fontStyle: 'italic' }}>found</span>) &#123;
                </span>
                <span>
                    <span style={{ paddingLeft: 15, color: '#2796ec' }}>
                        <i style={{ width: 10, display: 'inline-block' }} />throw
                    </span>
                    <span>
                        (<span style={{ color: '#a6a61f' }}>"(╯°□°)╯︵ ┻━┻"</span>);
                    </span>
                    <span style={{ display: 'block' }}>&#125;</span>
                </span>
            </div>
        </div>
    );
};

export default NotFound;
