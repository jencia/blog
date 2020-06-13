import React from 'react';

// styles
import styles from './Button.less';

const Button = ({ children, ...restProps }) => {
    return (
        <div className={styles.container} {...restProps}>
            {children}
        </div>
    );
};

export default Button;
