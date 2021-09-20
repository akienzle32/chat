import React from 'react';
import { Link } from "react-router-dom";
import './home.css';


export class Home extends React.Component {
  render() {
  	return (
  	  <div>
  		<div>
	  	  <a id="logout" href="http://127.0.0.1:8000/accounts/logout"><b>Log out</b></a>
	  	  <h1 id="home-title">Chat App</h1>
		</div>

		<div id="start-chat">
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
  		<div id="my-chats">
  		  <h3 className="container-title">My Chats</h3>
      		<div>
      		  <Link className="link" to="/chat">Chat</Link>
      		</div>
	 	</div>
  	  </div>
    );
  }
}