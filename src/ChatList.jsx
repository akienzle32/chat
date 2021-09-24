import React from 'react';
import { Link } from 'react-router-dom';

export class ChatList extends React.Component {

  // Maps chats to their participants.
  mapChats(){
  	const chats = this.props.chats;
  	const participants = this.props.participants;
  	const chatsAndPtcps = [];

  	for (let i = 0; i < chats.length; i++){
  		const usernameArray = [];
  		for (let j = 0; j < participants.length; j++){
  			if (chats[i].id === participants[j].chat_id)
  				usernameArray.push(participants[j].username);
  		}
  		let chatId = chats[i].id;
  		let chatName = chats[i].name;
  		let lastModified = chats[i].last_modified;
  		let convertedDate = this.convertDatetime(lastModified);
  		let parsedDate = new Date(convertedDate);
  		let JSONelement = {id:chatId, name:chatName, usernames:usernameArray, last_modified:parsedDate};
  		chatsAndPtcps.push(JSONelement);
  		
  	}

  	return(chatsAndPtcps);
  }

  // Sorts the mapped chats array by the last_modified column.
  sortChats(chatsAndPtcps){
  	const sortedChats = chatsAndPtcps.sort((chatA, chatB) => 
  		{ if (chatA.last_modified === chatB.last_modified)
          return 0;
        else if (chatA.last_modified === null)
          return -1;
        else if (chatB.last_modified === null)
          return 1;
        else 
          return chatA.last_modified < chatB.last_modified ? 1 : -1;
      });

  	return(sortedChats);
  }
  
  // Converts the data in last_modified column into a format that can be easily sorted by JavaScript.
  convertDatetime(datestring) {
  	let convertedDatetime;
  	if (datestring !== null){
  		const month = datestring.slice(5, 8);
		const day = datestring.slice(9, 11);
		const timestring = datestring.slice(12, 18);
		const year = new Date().getFullYear();
		const hour = timestring.slice(0, timestring.indexOf(":"));
  		const minutes = timestring.slice(timestring.indexOf(":"));
    
  		let paddedHour;
  		if (hour.length === 1)
  			paddedHour = '0' + hour;
  		else
  			paddedHour = hour;
    
  		let tempTime = paddedHour + minutes;
  		if (tempTime[5] === 'P'){
  			let hourstring = tempTime.slice(0, 2);
  			let intHour = parseInt(hourstring) + 12;
  			hourstring = intHour.toString();
  			tempTime = hourstring + minutes;
  		}
  		const time = tempTime.slice(0, 5) + ":00";
  		convertedDatetime = month + " " + day + ", " + year + " " + time;
  	}

  	return(convertedDatetime);
  }


  render() {
  	// Routine for displaying chats and their participants.
  	const chatsAndPtcps = this.mapChats();
  	const sortedChats = this.sortChats(chatsAndPtcps);
  	const chatList = sortedChats.map(chat => {
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