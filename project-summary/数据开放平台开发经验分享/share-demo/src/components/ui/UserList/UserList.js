import React from 'react';

import styles from './UserList.scss';

const UserList = ({ data = [] }) => {
    return (
        <ul>
            {data.map((user, index) => {
                const { name, email, birth } = user;

                return (
                    <li className={styles.user_info} key={index}>
                        <p>姓名：{name}</p>
                        <p>出生年月：{birth}</p>
                        <p>邮箱：{email}</p>
                    </li>
                );
            })}
        </ul>
    );
};

export default UserList;
