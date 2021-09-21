import React from 'react';
import { Link } from "react-router-dom";
import './App.css';


export class Home extends React.Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		chats: [{id:1, name:"Django"}, {id:2, name:"React"}],
  		participants: 	[{id:1, username:"alec", chat_id:1}, 
  						{id:2, username:"matt", chat_id:1},
  						{id:3, username:"alec", chat_id:2},
  						{id:4, username:"carol", chat_id:2}],
  	}
  }

 
  render() {
  	const chats = this.state.chats;
  	const participants = this.state.participants;
  	const chatsAndPtcs = [];

  	for (let i = 0; i < chats.length; i++){
  		const usernameArray = [];
  		for (let j = 0; j < participants.length; j++){
  			if (chats[i].id === participants[j].chat_id){
  				usernameArray.push(participants[j].username);
  			}
  		}
  		let chatName = chats[i].name;
  		let JSONelement = {name:chatName, usernames:usernameArray};
  		chatsAndPtcs.push(JSONelement);
  	}

  	const chatList = chatsAndPtcs.map(chat => {
  		let users = chat.usernames.join(", ");
  		let name = chat.name;
  		return <tr>
  				  <td><Link className="link" to={`${name}`}>{name}</Link></td>
  				  <td>{users}</td>
  				</tr>
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
  		  <h3 className="container-title">My chat rooms</h3>
      		<div>
      		  <table>
      		  	<tr>
      		  	  <th>Name</th>
      		  	  <th>Participants</th>
      		  	</tr>
      		  	{chatList}
      		  </table>
      		</div>
	 	</div>
  	  </div>
    );
  }
}