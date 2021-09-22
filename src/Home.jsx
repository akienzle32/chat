import React from 'react';
import { StartChat } from './StartChat';
import { ChatList } from './ChatList';
import { ChatRoom } from './ChatRoom';
import { Link } from 'react-router-dom';

export class Home extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		isClicked: false,
  	}
  }
  handleClick = () => {
  	this.setState({isClicked: true});
  }

  render() {
  	let component;
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