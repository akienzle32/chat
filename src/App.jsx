import React from 'react';
import { ChatRoom } from './ChatRoom';
import { StartChat } from './StartChat';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link } from "react-router-dom";

export class App extends React.Component {
  constructor(props){
  	super(props);
  	// Test data for managing state. This data gets passed down as props to child components. 
  	this.state = {
  		username: "alec",
  		chats: [{id:1, name:"Django", last_modified:"Tue, Sep 21 8:28PM"}, {id:2, name:"React", last_modified: "Wed, Sep 22 8:28PM"}],
  		participants:
  			[{id:1, username:"alec", chat_id:1}, 
  			{id:2, username:"matt", chat_id:1},
  			{id:3, username:"alec", chat_id:2},
  			{id:4, username:"carol", chat_id:2}],
  	}
  }
  // Test function for updating the state of the user's chats that gets passed down as a prop
  // to StartChat. Eventually, this will be two POST requests, one to a chat endpoint and the 
  // other to a participant endpoint.
  addChat = (chatname, ptcpArray) => {
  	let chats = this.state.chats;
  	const lastChat = chats[chats.length - 1];
  	const chatId = lastChat.id + 1;
  	const JSONchat = {id:chatId, name:chatname, last_modified:null}
  	chats = chats.concat(JSONchat);
  	console.log(chats);

  	let participants = this.state.participants;
  	const lastPtcp = participants[participants.length - 1];
  	let ptcpId = lastPtcp.id + 1;
  	let newPtcps = [];

  	const currentUsername = this.state.username;
  	const currentUserJSON = {id:ptcpId, username:currentUsername, chat_id:chatId};
  	newPtcps.push(currentUserJSON);
  	ptcpId++;

  	for (let i = 0; i < ptcpArray.length; i++){
  		let JSONelement = {id:ptcpId, username:ptcpArray[i], chat_id:chatId};
  		newPtcps.push(JSONelement); 
  		ptcpId++;
  	}
  	participants = participants.concat(newPtcps);
  	console.log(participants);
  	this.setState({
  		participants: participants,
  		chats: chats,
  	})
  }

  render() {
  	const { username, chats, participants } = this.state;
	return(
	  <Router>
	  	<div className="nav-bar">
  		  <Link className="link" to="/">Home</Link>
	  	  <a className="link" id="logout" href="http://127.0.0.1:8000/accounts/logout">Log out</a>
		</div>
	 	<Switch>
	 	  <Route path="/:name/:id">
  			<ChatRoom participants={participants} />;
  		  </Route>
		  <Route path="/">
			<StartChat username={username} chats={chats} participants={participants} onSubmit={this.addChat} />
		  </Route>
		</Switch>
	  </Router>
	);
  }
}