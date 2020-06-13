import React from 'react';

import reactCSS from 'reactcss';

const SizeMap = {
    small: 12,
    md: 24,
    large: 36
};

const WhiteSpace = ({ size = 'md' }) => {
    const height = SizeMap[size] ? SizeMap[size] : size;
    const styles = reactCSS({
        default: {
            whiteSpace: {
                padding: `${height / 2}px`
            }
        }
    });

    return <div style={styles.whiteSpace} />;
};

export default WhiteSpace;
