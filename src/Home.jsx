import React from 'react';
import { StartChat } from './StartChat';
import { ChatRoom } from './ChatRoom';
import { Link, Route } from 'react-router-dom';

export class Home extends React.Component {

  // Test function for updating the state of the user's chats. Eventually, this will be two POST requests. 

  // Determines the conditional rendering of either the StartChat/ChatList components OR the ChatRoom component.
  // This gets passed down as a prop to StartChat and then eventually to ChatList. 


  render() {

  	// By default, the user's list of chats is displayed. If the user clicks on a chat, then ChatRoom is rendered. 
  
	return (
	  <div>
		<div>
			<StartChat chats={this.props.chats} participants={this.props.participants} 
  	onSubmit={this.props.onSubmit} onClick={this.props.onClick} />;
		</div>
	  </div>
	);
  }
}