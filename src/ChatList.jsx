import React from 'react';
import { Link } from 'react-router-dom';

export const ChatList = (props) => {

  // Maps chats to their participants.
  const mapChats = () => {
    const currentUser = props.username;
  	const chats = props.chats;
  	let participants = props.participants;

  	const chatsAndPtcps = [];

  	for (let i = 0; i < chats.length; i++){
  		const usernameArray = [];
  		for (let j = 0; j < participants.length; j++){
          if (chats[i].id === participants[j].chat && participants[j].name !== currentUser)
  				  usernameArray.push(participants[j].name);
  		}
  		let chatId = chats[i].id;
  		let chatName = chats[i].name;
      let decodedChatName = decodeURIComponent(chatName);
      //console.log(usernameArray);
  		let lastModified = chats[i].last_modified;
  		//let convertedDate = convertDatetime(lastModified);
  		//let parsedDate = new Date(lastModified);
  		let JSONelement = {id:chatId, name:decodedChatName, usernames:usernameArray, last_modified:lastModified};
      //let JSONelement = {id:chatId, name:chatName, usernames:usernameArray};
  		chatsAndPtcps.push(JSONelement);
  	}

  	return(chatsAndPtcps);
  }


  // Sorts the mapped chats array by the last_modified column.
  const sortChats = (chatsAndPtcps) => {
  	const sortedChats = chatsAndPtcps.sort((chatA, chatB) =>
      { if (chatA.last_modified === chatB.last_modified)
          return 0;
        else if (chatA.last_modified === null)
          return -1;
        else if (chatB.last_modified === null)
          return 1;
        else if (new Date(chatA.last_modified) < new Date(chatB.last_modified))
          return 1;
        else
          return -1;
      });

  	return(sortedChats);
  }

  /*
  // Converts the data in last_modified column into a format that can be easily sorted in JavaScript.
  function convertDatetime(dateString) {
    let convertedDatetime;
    if (dateString !== null){
      const month = dateString.slice(5, 8);
      const day = dateString.slice(9, 11);
      const timeString = dateString.slice(12, 18);
      const year = new Date().getFullYear();
      const hour = timeString.slice(0, timeString.indexOf(":"));
      const minutes = timeString.slice(timeString.indexOf(":"));

      let paddedHour;
      if (hour.length === 1)
        paddedHour = '0' + hour;
      else
        paddedHour = hour;
      let tempTime = paddedHour + minutes;
      if (tempTime[5] === 'P'){
        let hourString = tempTime.slice(0, 2);
        let intHour = parseInt(hourString) + 12;
        hourString = intHour.toString();
        tempTime = hourString + minutes;
      }
      const time = tempTime.slice(0, 5) + ":00";
      convertedDatetime = month + " " + day + ", " + year + " " + time;
    }

    return(convertedDatetime);
  }
  */

  const handleClick = (name, chatId) => {
    const deleteChat = props.deleteChat;
    let deleteButton = window.confirm('Are you sure you want to delete the ' + name + ' chat room?');
    if (deleteButton){
      deleteChat(chatId);
    }
  }

  // Displays chats and their participants, with each chat linking to the ChatRoom component.
  const displayChats = () => {
    const chatsAndPtcps = mapChats();
    const sortedChats = sortChats(chatsAndPtcps);
    const chatList = sortedChats.map(chat => {
  		let users = chat.usernames.join(", ");
  		let name = chat.name;
      let encodedName = encodeURIComponent(name); // This variable is safe for use in a URL.
  		let id = chat.id;
  		return <tr key={id}>
  				  <td><Link className="link" to={`${encodedName}/${id}`}>{name}</Link></td>
  				  <td>{users}</td>
            <td><button onClick={() => handleClick(name, id)}>x</button></td>
  			   </tr>
  	})
    return(chatList);
  }



	return(
		<div>
  		  <div className="bottom-box" id="my-chats">
  		  	<h3 className="container-title">My chat rooms</h3>
      		  <div>
      		    <table className="chat-table">
      		      <tbody>
      		  	  	<tr>
      		  	  	  <th>Name</th>
      		  	  	  <th>Participants</th>
                    <th></th>
      		  	  	</tr>
      		  		  {displayChats()}
      		  	  </tbody>
      		  	</table>
            </div>
          </div>
        </div>

	 );
}