export default {
    [require.resolve('../pages/index/index.js')]: [
        {
            path: '/',
            component: () => import('@/pages/index/routes/Home'),
            exact: true
        }
    ]
};
