import React from 'react';

// components
import WhiteSpace from 'components/ui/WhiteSpace';
import UserListA from 'components/business/UserListA';
import UserListB from 'components/business/UserListB';

// styles
import styles from './Home.scss';

class Home extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <UserListA />

                <WhiteSpace />

                <UserListB />
            </div>
        );
    }
}

export default Home;
