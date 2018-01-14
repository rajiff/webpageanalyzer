import React from 'react';
import ReactDOM from 'react-dom';
import Routers from './views/App/Routers.jsx';
import registerServiceWorker from './registerServiceWorker';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

ReactDOM.render(
	<MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
   		<Routers />
  </MuiThemeProvider>,
document.getElementById('root'));
registerServiceWorker();

