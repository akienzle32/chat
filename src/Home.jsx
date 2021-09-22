import React from 'react';
import { StartChat } from './StartChat';
import { ChatRoom } from './ChatRoom';
import { Link } from 'react-router-dom';

export class Home extends React.Component {
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
  		isClicked: false,
  	}
  }

  // Test function for updating the state of the user's chats. Eventually, this will be two POST requests. 
  addChat = (chatname) => {
  	const chats = this.state.chats;
  	const lastChat = chats[chats.length - 1];
    const chatId = lastChat.id + 1;
    if (chatname !== null){
    	const JSONchat = {id:chatId, name:chatname}
  		const newChats = chats.concat(JSONchat);
  		console.log(newChats);

  		this.setState({
  			chats: newChats,
  		})
  	}
  }

/*
	const myUsername = this.state.username;
  	const otherUsername = this.input2;
  	const ptcps = this.state.participants;
  	const lastPtcp = ptcps[ptcps.length - 1];
  	const ptcpId = lastPtcp.id + 1;
  	const firstJsonPtcp = {id:ptcpId, username:myUsername, chat_id:chatId};
  	const secondJsonPtcp = {id:ptcpId+1, username: otherUsername, chat_id:chatId};
  	const tempPtcps = ptcps.concat(firstJsonPtcp);
  	const newPtcps = tempPtcps.concat(secondJsonPtcp);
  	console.log(newPtcps);
  		this.setState({
  			participants: newPtcps,
  		})
  */
  // Determines the conditional rendering of either the StartChat/ChatList components OR the ChatRoom component.
  // This gets passed down as a prop to StartChat and then eventually to ChatList. 
  handleClick = () => {
  	this.setState({isClicked: true});
  }

  render() {
  	let component;

  	// By default, the user's list of chats is displayed. If the user clicks on a chat, then ChatRoom is rendered. 
  	if (this.state.isClicked)
  		component = <ChatRoom participants={this.state.participants} />;
  	else
  		component = <StartChat chats={this.state.chats} participants={this.state.participants} 
  	onSubmit={this.addChat} onClick={this.handleClick} />;
	return (
	  <div>
		<div className="nav-bar">
  		  <Link className="link" to="/">Home</Link>
	  	  <a className="link" id="logout" href="http://127.0.0.1:8000/accounts/logout">Log out</a>
		</div>
		<div>
			{component}
		</div>
	  </div>
	);
  }
}