import React from 'react';
import { ChatRoom } from './ChatRoom';
import { Home } from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link  } from "react-router-dom";

export function App() {
	return(
		<Router>
		  <Switch>
			<Route path="/">
			  <Home />
			</Route>
		  </Switch>
		</Router>

	);
}