import React from 'react';
import { ChatRoom } from './ChatRoom';
import { StartChat } from './StartChat';
import { ChatList } from './ChatList';
import { Switch, Route, Link } from 'react-router-dom';
import './App.css';

export class Home extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
  		chats: [],
  		participants: [],
      newChatDisplay: "none",
  	}
  }

  displayNavBar = () => {
    let navBar = null;
    const loggedIn = this.props.loggedIn;
    const username = this.props.username;

    if (loggedIn){
      navBar = 
        <nav class="nav-bar">
          <Link className="logo" to="/">Chat App</Link>
          <ul className="nav-links">
            <li className="nav-item username" id="username">Signed in as: <b>{username}</b></li>
            <li className="nav-item logout"><button className="logout-btn" onClick={this.logoutUser}>Log out</button></li>
          </ul>
        </nav>
    }
    return(navBar);
  }

  getChats = () => {
    fetch(`${process.env.REACT_APP_API}/chats`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': this.props.token,
      },      
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
    fetch(`${process.env.REACT_APP_API}/participants`, {
      method: 'GET',
      mode: 'cors',
      headers: {
      	'Authorization': this.props.token,
      },
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

  // This method is called within addChat in order to allow both the chat and its participants to be added
  // with one submission. 
  addParticipant = (ptcp, chatId) => {
    const data = new FormData();
    data.append("name", ptcp);
    data.append("chat", chatId);
    const jsonData = JSON.stringify(Object.fromEntries(data));

    fetch(`${process.env.REACT_APP_API}/participants`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': this.props.token,
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

    fetch(`${process.env.REACT_APP_API}/chats`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': this.props.token,
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

  // This method is passed down as a prop to the ChatRoom component and allows for the state of the chats
  // to be updated based on a PUT request sent within ChatRoom.
  updateChatState = (jsonChat) => {
    const chats = this.state.chats;
    const chatId = jsonChat.id;

    const index = chats.findIndex(chat => chat.id === chatId);
    chats[index] = jsonChat;

    this.setState({
      chats: chats,
    })
  }

  // Removes the user from the participant list of the selected chat.
  removeFromChat = (chatId) => {
  	fetch(`${process.env.REACT_APP_API}/participants/${chatId}`, {
  		method: 'DELETE',
  		mode: 'cors',
      	headers: {
          'Authorization': this.props.token,
      	},
      	credentials: 'include',		
  	})
  	.then(this.props.handleErrors)
  	.then(response => {
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

  openChatModalBox = () => {
    this.setState({
      newChatDisplay: "inline-block",
    })
  }


  componentDidMount(){
    this.getChats();
    this.getParticipants();
  }

  render(){
  	const { username, loggedIn, token, handleErrors } = this.props;
  	const { chats, participants } = this.state; 
    const navBar = this.displayNavBar();

  	return (
      <div>
        {navBar}
        <div className="main-container">
          <div className="left-bar">
            <div className="chats-title-container">
              <h3 className="chats-title">My chats</h3>
              <button className="add-chat-btn" onClick={this.openChatModalBox}>+</button>
            </div>
            <ChatList username={username} chats={chats} participants={participants} removeFromChat={this.props.removeFromChat} />
          </div>
          <div className="start-chat-modal-box" style={{display: this.state.newChatDisplay}}>
              <StartChat username={username} chats={chats} participants={participants} token={token}
              onSubmit={this.addChat} removeFromChat={this.removeFromChat} />
          </div>
          <Switch>
            <Route path="/:name/:id">
              <ChatRoom username={username} participants={participants} 
              handleErrors={handleErrors} loggedIn={loggedIn} token={token} 
              addParticipant={this.addParticipant} updateChatState={this.updateChatState}   />
            </Route>
          </Switch>
        </div>
      </div>
  	);
  }
}
