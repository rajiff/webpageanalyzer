import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import WebDocDashboard from '../../components/WebDocDashboard';

import '../../index.css';

export default class Routers extends React.Component {
	render() {
		return (
			<HashRouter>
			<Switch>
        <Route exact path="/" component={WebDocDashboard} />
      </Switch>
      </HashRouter>
		)
	}
}