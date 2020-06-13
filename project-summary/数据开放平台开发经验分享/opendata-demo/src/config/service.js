export const isDev = process.env.NODE_ENV === 'development';

export const __MOCK__ = isDev; // 是否全局开启mock

// 对应webpack-dev-server中的proxy配置，开发环境前缀使用/opendata/api，生成环境使用/opendata
export const COMMON_API_PREFIX = isDev ? '/opendata-api' : '/opendata-server';

// 对应webpack-dev-server中的proxy配置
export const MOCK_API_PREFIX = '/mockApi';

// 额外的请求参数，给每个请求增加一个固定的参数值，用于调试使用
export const EXTRA_REQUEST_PARAMS = !isDev ? {} : {
    // creditCode: '91350206302822923W'
};
