import React from 'react';
import { ChatRoom } from './ChatRoom';
import { Home } from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route } from "react-router-dom";

export class App extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		username: "alec",
  		chats: [{id:1, name:"Django"}, {id:2, name:"React"}],
  		participants: 	[{id:1, username:"alec", chat_id:1}, 
  						{id:2, username:"matt", chat_id:1},
  						{id:3, username:"alec", chat_id:2},
  						{id:4, username:"carol", chat_id:2}],
  	}  	
  }
  render() {
	return(
		<Router>
		  <div>
		  	<Switch>
		  	  <Route path="/:name">
				<ChatRoom participants={this.state.participants} />
			  </Route>
			  <Route path="/">
			  	<Home username={this.state.username} chats={this.state.chats} participants={this.state.participants} />
			  </Route>
		  	</Switch>
		  </div>
		</Router>
	);
  }
}