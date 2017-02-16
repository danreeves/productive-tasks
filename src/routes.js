import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './containers/App';
import Tasks from './containers/Tasks';
import FourOhFour from './containers/404';

const Routes = (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Tasks} />
            <Route path="*" component={FourOhFour} />
        </Route>
    </Router>
);

export default Routes;
