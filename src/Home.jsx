import React from 'react';
import { ChatRoom } from './ChatRoom';
import { StartChat } from './StartChat';
import { Switch, Route } from 'react-router-dom';
import './App.css';

export class Home extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
  		chats: [],
  		participants: [],
  		csrftoken: this.props.getCookie('csrftoken'),

  	}
  }

  getChats = () => {
    fetch('http://127.0.0.1:8000/chat/chats', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    })
    .then(this.props.handleErrors)
    .then(response => {
      return response.json();
    })
    .then(chats => {
      if (chats){
        this.setState({
          chats: chats,
        })
      }
    })
    .catch(error => console.log(error))
  }

  getParticipants = () => {
    fetch('http://127.0.0.1:8000/chat/participants', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    })
    .then(this.props.handleErrors)
    .then(response => {
      return response.json();
    })
    .then(participants => {
      if (participants){
        this.setState({
          participants: participants,
        })
      }
    })
    .catch(error => console.log(error))
  }

  addParticipant = (ptcp, chatId) => {
    const data = new FormData();
    data.append("name", ptcp);
    data.append("chat", chatId);
    const jsonData = JSON.stringify(Object.fromEntries(data));

    fetch('http://127.0.0.1:8000/chat/participants', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'X-CSRFToken': this.state.csrftoken,
      },
      credentials: 'include',
      body: jsonData
    })
    .then(response => {
      if (response.status === 400)
        alert('Participant already in chat')
      else if (response.status === 404)
        alert('Username not found')
      else
        return response.json();
    })
    .then(newPtcp => {
      if(newPtcp){
        const participants = this.state.participants;
        this.setState({
          participants: participants.concat(newPtcp),
        })
      }
    })
  }

  addChat = (chatName, ptcpArray) => {

    const encodedChatName = encodeURIComponent(chatName); // Extra step needed in case a chat name includes a reserved URL character.
    const data = new FormData();
    data.append("name", encodedChatName);
    const jsonData = JSON.stringify(Object.fromEntries(data));

    let chatId;

    fetch('http://127.0.0.1:8000/chat/chats', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'X-CSRFToken': this.state.csrftoken,
      }, 
      credentials: 'include',
      body: jsonData    
    })
    .then(response => {
      return response.json();
    })
    .then(newChat => {
      chatId = newChat.id;
      const chats = this.state.chats;
      this.setState({
        chats: chats.concat(newChat),
      })

        const currentUser = this.props.username;
        const newPtcpArray = ptcpArray.concat(currentUser);

        for (let i = 0; i < newPtcpArray.length; i++){
          this.addParticipant(newPtcpArray[i], chatId);
        }
    })
  }

  updateChatState = (jsonChat) => {
    const chats = this.state.chats;
    const chatId = jsonChat.id;

    const index = chats.findIndex(chat => chat.id === chatId);
    chats[index] = jsonChat;

    this.setState({
      chats: chats,
    })
  }

  deleteChat = (chatId) => {
  	fetch('http://127.0.0.1:8000/chat/chats/' + chatId, {
  		method: 'DELETE',
  		mode: 'cors',
      	headers: {
          'X-CSRFToken': this.state.csrftoken,
      	},
      	credentials: 'include',		
  	})
  	.then(this.props.handleErrors)
  	.then(response => {
  		console.log(response);
  		if (response.status === 200){
  			const chats = this.state.chats;
  			const index = chats.findIndex(chat => chat.id === chatId);
  			chats.splice(index, 1);
  			this.setState({
  				chats: chats,
  			})
  		}
  	})
  	.catch(error => console.log(error))
  }


  componentDidMount(){
    this.getChats();
    this.getParticipants();
  }

  render(){
  	const { username, loggedIn, handleErrors } = this.props;
  	const { chats, participants, csrftoken } = this.state;

  	return (
  	 <div>
  	    <Switch>
     	  <Route path="/:name/:id">
  		  	<ChatRoom username={username} participants={participants} 
  		  		handleErrors={handleErrors} loggedIn={loggedIn} csrftoken={csrftoken} 
  		  		addParticipant={this.addParticipant} updateChatState={this.updateChatState}   />;
  		  </Route>
  		  <Route path="/">
 			<StartChat username={username} chats={chats} participants={participants} onSubmit={this.addChat} deleteChat={this.deleteChat} />
  		  </Route>
  		</Switch>
  	 </div>
  	);
  }
}
