import React from 'react';
import { ChatList } from './ChatList';
import { ChatRoom } from './ChatRoom';

export class StartChat extends React.Component {
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

 // Test function for updating the state of the user's chats. Eventually, this will be two POST requests. 
 handleSubmit = (event) => {
  	event.preventDefault();
  	const chatName = document.getElementById("chat-name").value;

  	const chats = this.state.chats;
  	const lastChat = chats[chats.length - 1];
  	const chatId = lastChat.id + 1;
  	const JSONchat = {id:chatId, name:chatName}
  	const newChats = this.state.chats.concat(JSONchat);
  	console.log(newChats);
  	this.setState({
  		chats: newChats,
  	})
  	
  	const myUsername = this.state.username;
  	const otherUsername = document.getElementById("ptc-name").value;
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
  	
  	document.getElementById("chat-form").reset();
  }
  render(){
  	return(
  	  <div>
		  <h1 id="home-title">Chat App</h1>
			<div className="top-box" id="start-chat">
    	  	  <h3 className="container-title">Start a new chat</h3>
      			<div>
        	  	  <div id="chat-form-container">
        	  		<form id="chat-form" onSubmit={this.handleSubmit}>
    			  	  <input type="text" id="chat-name" name="chatname" placeholder="Enter a chatroom name..."></input>
    			  	  <input type="text" id="ptc-name" name="username" placeholder="Enter a username..."></input>
           		  	  <input type="submit" id="submit-forms" className="submitButton"></input>
           			</form>
        	   	  </div>
      			</div>
  			</div>
  			<ChatList chats={this.state.chats} participants={this.state.participants} onClick={this.props.onClick} />
  	  </div>

  	);
  }
}