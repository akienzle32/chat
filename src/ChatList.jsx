import React from 'react';
import { Link } from 'react-router-dom';

export class ChatList extends React.Component {
  render() {
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
	return(
		<div>
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