import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './containers/App';
import Home from './containers/Home';
import FourOhFour from './containers/404';

const Routes = (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="*" component={FourOhFour} />
        </Route>
    </Router>
);

export default Routes;
