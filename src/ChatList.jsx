import React from 'react';
import { Link } from 'react-router-dom';

export class ChatList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      removeBtnDisplay = "none",
    }
  }

  // Maps chats to their participants.
  mapChats = () => {
    const currentUser = this.props.username;
  	const chats = this.props.chats;
  	let participants = this.props.participants;

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
  		let lastModified = chats[i].last_modified;
  		let JSONelement = {id:chatId, name:decodedChatName, usernames:usernameArray, last_modified:lastModified};
  		chatsAndPtcps.push(JSONelement);
  	}

  	return(chatsAndPtcps);
  }


  // Sorts the mapped chats array by the last_modified column. If the last_modified column is null
  // (because the chat room was just created), then the chat will sorted to the top.
  sortChats = (chatsAndPtcps) => {
  	const sortedChats = chatsAndPtcps.sort((chatA, chatB) =>
      { if (chatA.last_modified === chatB.last_modified)
          return 0;
        else if (chatA.last_modified === null) // Refactor
          return -1;
        else if (chatB.last_modified === null) // Refactor
          return 1;
        else if (new Date(chatA.last_modified) < new Date(chatB.last_modified))
          return 1;
        else
          return -1;
      });

  	return(sortedChats);
  }

  handleClick = (name, chatId) => {
    const removeFromChat = this.props.removeFromChat;
    let deleteButton = window.confirm('Are you sure you want remove yourself from the ' + name + ' chat room?');
    if (deleteButton){
      removeFromChat(chatId);
    }
  }

  onHover = () => {
    const display = null;
    return display;
  }

  // Displays chats and their participants, with each chat linking to the ChatRoom component.
  displayChats = () => {
    const chatsAndPtcps = mapChats();
    const sortedChats = sortChats(chatsAndPtcps);
    const chatList = sortedChats.map(chat => {
  		let users = chat.usernames.join(", ");
  		let name = chat.name;
      let encodedName = encodeURIComponent(name); // This variable is safe for use in a URL.
  		let id = chat.id;
      return <li key={chat.id} className="chat-item">
              <button className="remove-btn" id="remove" onClick={() => handleClick(name, id)}>X</button>
              <div className="chat-info">
                <Link className="chat-link" to={`/${encodedName}/${id}`}><b>{name}</b>
                  <p className="ptcp-list">{users}</p>
                </Link>
              </div>
            </li>


  	})
    return(chatList);
  }

  render() {

    return(
      <div>
        <ul className="chat-list">
          {displayChats()}
        </ul>
      </div>
    );
  }
}