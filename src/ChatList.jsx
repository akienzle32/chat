import React from 'react';
import { Link } from 'react-router-dom';

export class ChatList extends React.Component {
  render() {

  	// Routine for mapping each individual chat to its participants and displaying the data. 
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
  		let chatId = chats[i].id;
  		let chatName = chats[i].name;
  		let JSONelement = {id:chatId, name:chatName, usernames:usernameArray};
  		chatsAndPtcps.push(JSONelement);
  	}

  	const chatList = chatsAndPtcps.map(chat => {
  	let users = chat.usernames.join(", ");
  	let name = chat.name;
  	let id = chat.id;
  		return <tr key={name}>
  				  <td><Link onClick={this.props.onClick} className="link" to={`${name}/${id}`}>{name}</Link></td>
  				  <td>{users}</td>
  			   </tr>
  	})
	return(
		<div>
  		  <div className="bottom-box" id="my-chats">
  		  	<h3 className="container-title">My chat rooms</h3>
      		  <div>
      		    <table>
      		      <tbody>
      		  	  	<tr>
      		  	  	  <th>Name</th>
      		  	  	  <th>Participants</th>
      		  	  	</tr>
      		  		{chatList}
      		  	  </tbody>
      		  	</table>
      		  </div>
	 		</div>
  	  	</div>

	);
  }
}