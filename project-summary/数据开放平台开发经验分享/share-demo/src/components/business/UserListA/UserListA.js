import React, { Component } from 'react';
import classNames from 'classnames';

// components
import Button from 'components/ui/Button';
import WhiteSpace from 'components/ui/WhiteSpace';
import UserList from 'components/ui/UserList';
import { Scrollbars } from 'react-custom-scrollbars';
import { Spin } from 'antd';

// services
import { getUserList } from '../../../services/user';

// utils
import { sleep } from '../../../utils';

// styles
import styles from './UserListA.scss';

class UserListA extends Component {
    state = {
        userList: [],
        loading: false
    };

    requestData = async () => {
        this.setState({
            loading: true
        });
        await sleep(1500);
        const data = await getUserList();

        this.setState(
            ({ userList }) => {
                return {
                    loading: false,
                    userList: [...userList, ...data]
                };
            },
            () => {
                this.listContainer.scrollToBottom();
            }
        );
    };

    render() {
        const { userList, loading } = this.state;
        const userListClassNames = classNames(styles.box, styles.user_list);

        return (
            <div>
                <p className={styles.title}>不使用dva</p>
                <Scrollbars
                    ref={r => (this.listContainer = r)}
                    style={{ width: 420, height: 600 }}
                    className={userListClassNames}
                    autoHide
                >
                    <WhiteSpace size="small" />

                    <UserList data={userList} />
                    {loading && (
                        <div>
                            <Spin />
                            <p>加载中...</p>
                        </div>
                    )}
                    <Button onClick={this.requestData}>{userList.length > 0 ? '加载更多' : '获取用户列表'}</Button>
                    <WhiteSpace size="small" />
                </Scrollbars>
            </div>
        );
    }
}

export default UserListA;
