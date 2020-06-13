const isDev = process.env.NODE_ENV === 'development';

export const __MOCK__ = isDev; // 是否全局开启mock

export const COMMON_API_PREFIX = isDev ? '/api' : '/xxx'; // 对应webpack-dev-server中的proxy配置/api, xxx配置为生产环境下

export const MOCK_API_PREFIX = '/mockApi'; // 对应webpack-dev-server中的proxy配置

/* ============== 按照接口分类定义下列接口 ============== */

export const user = {
    getUserList: '/user/list'
};

export const order = {
    getOrderInfo: '/order/:id'
};

export const logout = {
    logout: '/logout'
};
