import React from 'react';
import { ChatRoom } from './ChatRoom';
import { StartChat } from './StartChat';
import { Login } from './Login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link } from "react-router-dom";

export class App extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		username: "",
      loggedIn: false,
      chats: [],
  		participants: [],
  	}
    this.csrftoken = this.getCookie('csrftoken');
  }

  // Function provided by Django for adding csrf tokens to AJAX requests; see https://docs.djangoproject.com/en/3.2/ref/csrf/ for details.
  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  handleErrors(response) {
    if (!response.ok){
      throw Error(response.statusText);
    }
    return(response);
  }

  getUsername = () => {
    fetch('http://127.0.0.1:8000/chat/current-user', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    })
    .then(this.handleErrors)
    .then(response => {
      if (response.redirected){
        window.location.href = response.url;
        return;
      }
      else
        return response.json();
    })
    .then(username => {
      if (username){
        this.setState({
          username: username.username,
      });
      this.userLoggedIn();
      }
    })
    .catch(error => console.log(error))
  }

  getChats = () => {
    fetch('http://127.0.0.1:8000/chat/chats', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    })
    .then(this.handleErrors)
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
    .then(this.handleErrors)
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

  componentDidMount(){
    this.getUsername();
    this.getChats();
    this.getParticipants();
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
        'X-CSRFToken': this.csrftoken,
      },
      credentials: 'include',
      body: jsonData
    })
    .then(response => {
      if (response.status === 400)
        alert('Participant already in chat')
      else if (response.status === 404)
        alert('Username does not exist')
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
        'X-CSRFToken': this.csrftoken,
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

        const currentUser = this.state.username;
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
  userLoggedIn = () => {
    this.setState({loggedIn: true});
  }

  displayLoginOrLogout(){
    let navButton;
    const loggedIn = this.state.loggedIn;
    if (loggedIn)
      navButton = <li className="right-nav-element"><a className="link" href="http://127.0.0.1:8000/accounts/logout">Log out</a></li>;
    else
      navButton = <li className="right-nav-element"><a className="link" href="http://127.0.0.1:8000/accounts/login">Login</a></li>;

    return(navButton);
  }

  displayUsername(){
    let usernameIcon;
    const username = this.state.username;
    if (username)
      usernameIcon = <li className="right-nav-element" id="username">Signed in as <b>{username}</b></li>
    else
      usernameIcon = <li className = "right-nav-element" id="username"></li>
    return(usernameIcon);
  }

  render() {
    const { username, chats, loggedIn, participants } = this.state;
    const navButton = this.displayLoginOrLogout();
    const usernameIcon = this.displayUsername();

	  return(
	   <Router>
	  	<div>
        <ul className="nav-bar">
  		    <li className="left-nav-element"><Link className="link" to="/">Home</Link></li>
          <li className="left-nav-element"><Link className="link" to="/login">Login</Link></li>
          {navButton}
          {usernameIcon}
        </ul>
		  </div>  
	 	  <Switch>
        <Route path="/:name/:id">
  			 <ChatRoom username={username} participants={participants} userLoggedIn={this.userLoggedIn} 
          addParticipant={this.addParticipant} handleErrors={this.handleErrors} 
          updateChatState={this.updateChatState} loggedIn={loggedIn}  />;
  		  </Route>
        <Route path="/login" handleError={this.handleErrors}>
          <Login />
        </Route>
		    <Route path="/">
			   <StartChat username={username} chats={chats} participants={participants} onSubmit={this.addChat} />
		    </Route>
		  </Switch>
	  </Router>
	 );
  }
}