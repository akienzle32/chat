import React from 'react';
import { Link } from "react-router-dom";
import './App.css';


export class Home extends React.Component {

  // Test function for handling multiple input boxes. This will eventually handle two POST requests.
  /*
  handleSubmit = (event) => {
  	event.preventDefault();
  	const chatName = document.getElementById("chat-name").value;

  	const chats = this.props.chats;
  	const lastChat = chats[chats.length - 1];
  	const chatId = lastChat.id + 1;
  	const JSONchat = {id:chatId, name:chatName}
  	const newChats = this.state.chats.concat(JSONchat);
  	console.log(newChats);
  	this.setState({
  		chats: newChats,
  	})
  	
  	const myUsername = this.props.username;
  	const otherUsername = document.getElementById("ptc-name").value;
  	const ptcps = this.props.participants;
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

  */
  render() {
  	// Routine for displaying the user's chats and their participants. This will need to be moved to a 
  	// componentDidMount function once GET requests are functioning, but the logic should remain the same. 
  	const chats = this.props.chats;
  	const participants = this.props.participants;
  	const chatsAndPtcps = [];

  	for (let i = 0; i < chats.length; i++){
  		const usernameArray = [];
  		for (let j = 0; j < participants.length; j++){
  			if (chats[i].id === participants[j].chat_id){
  				usernameArray.push(participants[j].username);
  			}
  		}
  		let chatName = chats[i].name;
  		let JSONelement = {name:chatName, usernames:usernameArray};
  		chatsAndPtcps.push(JSONelement);
  	}

  	const chatList = chatsAndPtcps.map(chat => {
  		let users = chat.usernames.join(", ");
  		let name = chat.name;
  		return <tr key={name}>
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
        	  	<form id="chat-form" onSubmit={this.handleSubmit}>
    			  <input type="text" id="chat-name" name="chatname" placeholder="Enter a chatroom name..."></input>
    			  <input type="text" id="ptc-name" name="username" placeholder="Enter a username..."></input>
           		  <input type="submit" id="submit-forms" className="submitButton"></input>
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