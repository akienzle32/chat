import React from 'react';
import { StartChat } from './StartChat';
import { ChatRoom } from './ChatRoom';
import { Link } from 'react-router-dom';

export class Home extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		isClicked: false,
  	}
  }

  // Determines the conditional rendering of either the StartChat/ChatList components OR the ChatRoom component.
  // This gets passed down as a prop to StartChat and then eventually to ChatList. 
  handleClick = () => {
  	this.setState({isClicked: true});
  }

  render() {
  	let component;

  	// By default, the user's list of chats is displayed. If the user clicks on a chat, then ChatRoom is rendered. 
  	if (this.state.isClicked)
  		component = <ChatRoom />;
  	else
  		component = <StartChat onClick={this.handleClick}  />;
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