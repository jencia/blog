import React, { lazy, Suspense } from 'react';
import { Router, Switch, Route } from 'dva/router';

function RouterConfig({ history }) {
    const routes = [
        {
            path: '/',
            component: lazy(() => import('./routes/Home')),
            exact: true
        }
    ];

    return (
        <Router history={history}>
            <Suspense fallback="loading...">
                <Switch>{routes.map(route => <Route key={route.path} {...route} />)}</Switch>
            </Suspense>
        </Router>
    );
}

export default RouterConfig;
