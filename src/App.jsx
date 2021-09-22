import React from 'react';
import { ChatRoom } from './ChatRoom';
import { Home } from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link } from "react-router-dom";

export class App extends React.Component {


  render() {
	return(
	  <Router>
	 	<Switch>
	 	  <Route path="/:name">
	 	  	<ChatRoom />
	 	  </Route>
		  <Route path="/">
			  <Home />
		  </Route>
		</Switch>
	  </Router>
	);
  }
}