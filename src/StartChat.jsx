import React from 'react';
import { ChatList } from './ChatList';

export class StartChat extends React.Component {


  // Function to pass text input up to App component, where the state of chats and participants 
  // is tracked. 
  onSubmit = (event) => {
    event.preventDefault();

    const chatName = document.getElementById("chat-name").value;
    const ptcpName = document.getElementById("ptc-name").value;
    this.props.onSubmit(chatName, ptcpName);
    document.getElementById("chat-form").reset();
  }

  render() {
  	return(
  	  <div>
		  <h1 id="home-title">Chat App</h1>
			<div className="top-box" id="start-chat">
    	  	  <h3 className="container-title">Start a new chat</h3>
      			<div>
        	  	  <div id="chat-form-container">
        	  		<form id="chat-form" onSubmit={this.onSubmit}>
    			  	    <input type="text" id="chat-name" name="chatname" placeholder="Enter a chatroom name..."></input>
                  <input type="text" id="ptc-name" name="username" placeholder="Enter a username..."></input>
           		    <input type="submit" id="submit-forms" className="submitButton"></input>
           			</form>
        	   	  </div>
      			</div>
  			</div>
  			<ChatList chats={this.props.chats} participants={this.props.participants} />
  	  </div>
  	);
  }
}