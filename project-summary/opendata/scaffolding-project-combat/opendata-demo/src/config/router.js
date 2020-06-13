/*
 * @(#) router.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * Copyright:  Copyright (c) 2019
 * Company:厦门畅享信息技术有限公司
 * @author yangjc
 * 2019-12-02 14:32:41
 */

import React, { lazy, Suspense } from 'react';
import dva from 'dva';
import { Router, Switch, Route, Redirect } from 'dva/router';
import createLoading from 'dva-loading';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import BasicLayout from '@/layouts/BasicLayout';
import PageLoading from '@/components/loading/PageLoading';
import NoFound from '@/components/NoFound';
import InternalServerError from '@/components/InternalServerError';

import userModel from '@/models/user';
import bmModel from '@/models/bm';
import mapRoutes from './mapRoutes';

class ErrorBoundary extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError(e) {
        console.log(e);
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return <InternalServerError />;
        }
        return this.props.children;
    }
}

/**
 * 获取路由器配置，涉及整体布局、全局context
 * @param {Array} routes        // 路由配置
 * @param {string} indexPath    // 首页重定向的地址
 * @param Layout
 * @return {function({history: *}): *}
 */
export function getRouterConfig (routes = [], indexPath, Layout = BasicLayout) {
    return ({ history }) => (
        <ConfigProvider locale={zhCN}>
            <ErrorBoundary>
                <Router history={history}>
                    <Suspense fallback={<PageLoading />}>
                        <Switch>
                            {indexPath && (
                                <Route path="/" exact render={() => <Redirect to={indexPath} />} />
                            )}
                            {routes.map(route => {
                                const { path, exact, component, ...layoutProps } = route;
                                const AsyncComponent = lazy(component);

                                return (
                                    <Route
                                        key={path}
                                        path={path}
                                        exact={exact}
                                        render={props => (
                                            <Layout {...layoutProps}>
                                                <AsyncComponent {...props} />
                                            </Layout>
                                        )}
                                    />
                                );
                            })}
                            <Route component={NoFound} />
                        </Switch>
                    </Suspense>
                </Router>
            </ErrorBoundary>
        </ConfigProvider>
    );
}

/**
 * 设置路由器
 * @param {string|{
 *   moduleId: string,
 *   indexPath?: string,
 *   routes?: Array,
 *   Layout?: function
 * }} opt  配置参数，值为字符串时，作为moduleId处理
 * @param {string} opt.moduleId     模块Id，指向一个地址，一般直接写module.id，这是webpack提供的对象值
 * @param {string} [opt.indexPath]  首页重定向的地址
 * @param {Array} [opt.routes]      自定义路由配置，会与系统生成的配置合并，重复的会覆盖原来的
 * @param {function} [opt.Layout]
 */
export default function setRouter(opt) {
    const { moduleId, indexPath, routes, Layout } = typeof opt === 'object' ? opt : { moduleId: opt };
    const app = dva();
    const mergeRoutes = (mapRoutes[moduleId] || [])
        .filter(route => !(routes || []).find(v => v.path === route.path))
        .concat(routes || []);

    app.use(createLoading());
    app.model(userModel);
    app.model(bmModel);
    app.router(getRouterConfig(mergeRoutes, indexPath, Layout));
    app.start('#root');

    return app;
}
