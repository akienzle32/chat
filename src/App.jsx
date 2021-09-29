import React from 'react';
import { ChatRoom } from './ChatRoom';
import { StartChat } from './StartChat';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link } from "react-router-dom";

export class App extends React.Component {
  constructor(props){
  	super(props);
  	// Test data for managing state. This data gets passed down as props to child components. 
  	this.state = {
  		username: "",
      loggedIn: false,
  		//chats: [{id:1, name:"Django", last_modified:"Tue, Sep 21 8:28PM"}, {id:2, name:"React", last_modified: "Wed, Sep 22 8:28PM"}],
      chats: [{id:1, name:"Django"}, {id:2, name:"React"}],
  		participants:
  			[{id:1, username:"alec", chat_id:1}, 
  			{id:2, username:"matt", chat_id:1},
  			{id:3, username:"alec", chat_id:2},
  			{id:4, username:"carol", chat_id:2},
        {id:5, username:"steve", chat_id:2}],
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


  getUsername = () => {
    fetch('http://127.0.0.1:8000/chat/user', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then(response => {
      if (response.status !== 200){
        alert("Please log in."); // Temporary solution.
        return;
      }
      else
        return response.json();
    }).then(username => {
      if (username){
        console.log(username);
        this.setState({
          username: username.username,
      });
      this.userLoggedIn();
      }
    })
  }

  componentDidMount(){
    this.getUsername();
  }
  // Test function for updating the state of the user's chats that gets passed down as a prop
  // to StartChat. Eventually, this will be two POST requests, one to a chat endpoint and the 
  // other to a participant endpoint.
  addChat = (chatname, ptcpArray) => {
  	let chats = this.state.chats;
  	const lastChat = chats[chats.length - 1];
  	const chatId = lastChat.id + 1;
  	//const JSONchat = {id:chatId, name:chatname, last_modified:null}
    const JSONchat = {id:chatId, name:chatname}
  	chats = chats.concat(JSONchat);
  	console.log(chats);

  	let participants = this.state.participants;
  	const lastPtcp = participants[participants.length - 1];
  	let ptcpId = lastPtcp.id + 1;
  	let newPtcps = [];

    // Automatically add the current user to the newly created chat.
  	const currentUsername = this.state.username;
  	const currentUserJSON = {id:ptcpId, username:currentUsername, chat_id:chatId};
  	newPtcps.push(currentUserJSON);
  	ptcpId++;

  	for (let i = 0; i < ptcpArray.length; i++){
  		let ptcpJSON = {id:ptcpId, username:ptcpArray[i], chat_id:chatId};
  		newPtcps.push(ptcpJSON); 
  		ptcpId++;
  	}
  	participants = participants.concat(newPtcps);
  	console.log(participants);
  	this.setState({
  		participants: participants,
  		chats: chats,
  	})
  }

  userLoggedIn = () => {
    this.setState({loggedIn: true});
  }

  render() {
    const { username, chats, loggedIn, participants } = this.state;

	  return(
	   <Router>
	  	<div className="nav-bar">
  		  <Link className="link" to="/">Home</Link>
	  	  <a className="link" id="logout" href="http://127.0.0.1:8000/accounts/logout">Log out</a>
		  </div>
	 	  <Switch>
        <Route path="/:name/:id">
  			 <ChatRoom username={username} participants={participants} userLoggedIn={this.userLoggedIn} loggedIn={loggedIn}  />;
  		  </Route>
		    <Route path="/">
			   <StartChat username={username} chats={chats} participants={participants} onSubmit={this.addChat} />
		    </Route>
		  </Switch>
	  </Router>
	 );
  }
}