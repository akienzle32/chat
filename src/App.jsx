import React from 'react';
import { GetParams } from './ChatRoom';
import { Home } from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route } from "react-router-dom";

export function App() {
	return(
		<Router>
		  <div>
		  	<Switch>
		  	  <Route path="/:name">
				<GetParams />
			  </Route>
			  <Route path="/">
			  	<Home />
			  </Route>
		  	</Switch>
		  </div>
		</Router>

	);
}