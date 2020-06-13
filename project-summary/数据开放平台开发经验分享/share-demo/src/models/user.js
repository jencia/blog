import * as usersService from '../services/user';

export default {
    namespace: 'user',

    state: {
        userList: [],
        loading: false
    },

    reducers: {
        loading(state, { status = false }) {
            return { ...state, loading: status };
        },
        updateUserList(state, { data }) {
            return {
                ...state,
                userList: [...state.userList, ...data]
            };
        }
    },

    effects: {
        *getUserList({ success }, { call, put }) {
            yield put({
                type: 'loading',
                status: true
            });

            try {
                const data = yield call(usersService.getUserList);

                yield put({
                    type: 'updateUserList',
                    data
                });

                success && success();
            } catch (e) {
                console.error('getuserList error =>', e);
            } finally {
                yield put({
                    type: 'loading',
                    status: false
                });
            }
        }
    },
    subscriptions: {
    }
};
