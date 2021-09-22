import React from 'react';
import { StartChat } from './StartChat';
import { ChatList } from './ChatList';
import { Link } from 'react-router-dom';

export class Home extends React.Component {
  render() {
	return (
	  <div>
		<div className="nav-bar">
  		  <Link className="link" to="/">Home</Link>
	  	  <a className="link" id="logout" href="http://127.0.0.1:8000/accounts/logout">Log out</a>
		</div>
		<div>
			<StartChat />
		</div>
	  </div>
	);
  }
}