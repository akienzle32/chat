import React from 'react';
import { Link } from "react-router-dom";
import './App.css';


export class Home extends React.Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		chats: [{id:1, name:"Django"}, {id:2, name:"React"}],
  	}
  }
  render() {
  	const chats = this.state.chats;
  	const chatList = chats.map(chat => {
  		return  <div>
  				  <ul>
  				  	<li><Link className="link" to="/chat">{chat.name}</Link></li>
  				  </ul>
  				</div>
  	})
  	return (
  	  <div>
  		<div className="nav-bar">
  		  <Link className="link" to="/">Home</Link>
	  	  <a className="link" id="logout" href="http://127.0.0.1:8000/accounts/logout">Log out</a>
		</div>
		<div><h1 id="home-title">Chat App</h1></div>

		<div className="top-box" id="start-chat">
    	  <h3 className="container-title">Start a new chat</h3>
      		<div>
        	  <div id="chat-form-container">
    		  	<form id="chat-form" method="post">
    			  <input type="text" id="chat-name" name="chatname" placeholder="Enter a chatroom name..."></input>
    			  <input type="text" id="ptc-name" name="username" placeholder="Enter a username..."></input>
           		  <input type="button" value="+" id="add-ptc-button"></input>
           		  <input id="submit-forms" type="submit"></input>
          		</form>
        	  </div>
      		</div>
  		</div>
  		<div className="bottom-box" id="my-chats">
  		  <h3 className="container-title">My Chat Rooms</h3>
      		<div>{chatList}</div>
	 	</div>
  	  </div>
    );
  }
}