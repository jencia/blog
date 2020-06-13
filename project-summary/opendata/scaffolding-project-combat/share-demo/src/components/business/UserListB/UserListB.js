import React from 'react';
import { connect } from 'dva';
import classNames from 'classnames';

// components
import Button from 'components/ui/Button';
import WhiteSpace from 'components/ui/WhiteSpace';
import UserList from 'components/ui/UserList';
import { Scrollbars } from 'react-custom-scrollbars';
import { Spin } from 'antd';

// styles
import styles from './UserListB.scss';

class UserListB extends React.Component {
    requestData = () => {
        const { dispatch } = this.props;

        dispatch({
            type: 'user/getUserList',
            success: () => {
                this.listContainer.scrollToBottom();
            }
        });
    };

    render() {
        const { loading, userList } = this.props;

        const userListClassNames = classNames(styles.box, styles.user_list);

        return (
            <div>
                <p className={styles.title}>dva中的数据流</p>
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

function mapStateToProps({ user }) {
    const { loading, userList } = user;

    return {
        loading,
        userList
    };
}

export default connect(mapStateToProps)(UserListB);
