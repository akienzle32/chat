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
  addChat = (chatname, ptcpname) => {
  	const chats = this.state.chats;
  	const lastChat = chats[chats.length - 1];
    const chatId = lastChat.id + 1;
    const datetime = this.addTime();
    const JSONchat = {id:chatId, name:chatname, last_modified:datetime}
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
  		chats: newChats,
  	})
  }
  
  // Tester function for adding a date to a new chat. We may eventually want to refrain from actually adding 
  // a chat to the database until a message has been sent (I think this is how iMessage works?), but with the
  // current setup, I have to add a datetime into last_modified right when a chat is created. 
  addTime(){
  	const weekday = "Thu";
  	const month = "Sep";
  	const day = "23";
  	const time = "10:47AM";

  	const datetime = weekday + ", " + month + " " + day + " " + time;

  	return(datetime);

  }

  render() {
	return(
	  <Router>
	  	<div className="nav-bar">
  		  <Link className="link" to="/">Home</Link>
	  	  <a className="link" id="logout" href="http://127.0.0.1:8000/accounts/logout">Log out</a>
		</div>
	 	<Switch>
	 	  <Route path="/:name/:id">
  			<ChatRoom participants={this.state.participants} />;
  		  </Route>
		  <Route path="/">
			<StartChat chats={this.state.chats} participants={this.state.participants} onSubmit={this.addChat} />
		  </Route>
		</Switch>
	  </Router>
	);
  }
}