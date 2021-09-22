import React from 'react';
import { ChatRoom } from './ChatRoom';
import { Home } from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link } from "react-router-dom";

export class App extends React.Component {
  constructor(props){
  	super(props);
  	// Test data for managing state. 
  	this.state = {
  		username: "alec",
  		chats: [{id:1, name:"Django"}, {id:2, name:"React"}],
  		participants:
  			[{id:1, username:"alec", chat_id:1}, 
  			{id:2, username:"matt", chat_id:1},
  			{id:3, username:"alec", chat_id:2},
  			{id:4, username:"carol", chat_id:2}],
  	}
  }
  // Test function for updating the state of the user's chats. Eventually, this will be two POST requests, one 
  // to a chat endpoint and the other to a participant endpoint.
  addChat = (chatname, ptcpname) => {
  	const chats = this.state.chats;
  	const lastChat = chats[chats.length - 1];
    const chatId = lastChat.id + 1;
    const JSONchat = {id:chatId, name:chatname}
  	const newChats = chats.concat(JSONchat);
  	console.log(newChats);

  	const myUsername = this.state.username;
  	const ptcps = this.state.participants;
  	const lastPtcp = ptcps[ptcps.length - 1];
  	const ptcpId = lastPtcp.id + 1;
  	const firstJsonPtcp = {id:ptcpId, username:myUsername, chat_id:chatId};
  	const secondJsonPtcp = {id:ptcpId+1, username:ptcpname, chat_id:chatId};
  	const tempPtcps = ptcps.concat(firstJsonPtcp);
  	const newPtcps = tempPtcps.concat(secondJsonPtcp);
  	console.log(newPtcps);
  		this.setState({
  			participants: newPtcps,
  		})

  	this.setState({
  		chats: newChats,
  	})
  }

  render() {
	return(
	  <Router>
	  	<div className="nav-bar">
  		  <Link className="link" to="/">Home</Link>
	  	  <a className="link" id="logout" href="http://127.0.0.1:8000/accounts/logout">Log out</a>
		</div>
	 	<Switch>
	 	  <Route path="/:name">
  			<ChatRoom participants={this.state.participants} />;
  		  </Route>
		  <Route path="/">
			<Home chats={this.state.chats} participants={this.state.participants} onSubmit={this.addChat} />
		  </Route>
		</Switch>
	  </Router>
	);
  }
}