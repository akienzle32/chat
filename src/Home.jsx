import React from 'react';
import { ChatRoom } from './ChatRoom';
import { StartChat } from './StartChat';
import { ChatList } from './ChatList';
import { Switch, Route, withRouter } from 'react-router-dom';
import './App.css';

class Home extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {
  		chats: [],
  		participants: [],
      newChatDisplay: "none",
      chatRoomMounted: false,
  	}
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
      if (response.status === 400)
        alert("Invalid chat name");
      else
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

      newPtcpArray.forEach(ptcp => {
        this.addParticipant(ptcp, chatId);
      })
    })
    .catch(error => console.log(error));
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

  toggleChatModalBox = () => {
    if (this.state.newChatDisplay === "none"){
      this.setState({
        newChatDisplay: "inline-block",
      })
    }
    else {
      this.setState({
        newChatDisplay: "none",
      })
    }
  }

  changeCurrentChat = () => {
    const pathname = window.location.pathname;
    this.setState({
      pathname: pathname,
    })
  }

  displayHomeGraphic(pathname) {
    let component;

    if (pathname === '/'){
      component =           
        <div className="home-container">
          <div className="graphic-container">
            <div className="graphic-message">
              <div><p>The Chat App</p></div>
            </div>
            <div className="graphic-message" style={{marginLeft: "150px"}}>
              <div><p className="home-subtitle">Designed by Alec Kienzle</p></div>
            </div>
          </div>
        </div>
    }
    return component;
  }

  componentDidMount(){
    this.getChats();
    this.getParticipants();
    this.changeCurrentChat();
  }

  render(){
  	const { username, loggedIn, token, handleErrors } = this.props;
  	const { chats, participants } = this.state;
    const pathname = this.props.location.pathname;
    const graphic = this.displayHomeGraphic(pathname);

  	return (
      <div className="main-container">
        <div className="left-bar">
          <div className="chats-title-container">
            <h3 className="chats-title">My chats</h3>
            <button className="add-chat-btn" onClick={this.toggleChatModalBox}>+</button>
          </div>
          <ChatList username={username} chats={chats} participants={participants} removeFromChat={this.removeFromChat} />
        </div>
        <div className="start-chat-modal-box" style={{display: this.state.newChatDisplay}}>
          <StartChat username={username} chats={chats} participants={participants} token={token}
          onSubmit={this.addChat} removeFromChat={this.removeFromChat} toggleChatModalBox={this.toggleChatModalBox} />
        </div>
        {graphic}
        <Switch>
          <Route path="/:name/:id">
            <ChatRoom key={this.props.location.pathname} username={username} participants={participants} 
            handleErrors={handleErrors} loggedIn={loggedIn} token={token} 
            addParticipant={this.addParticipant} updateChatState={this.updateChatState}
            toggleBackgroundColor={this.toggleBackgroundColor} />
          </Route>
        </Switch>
      </div>
  	);
  }
}
export default withRouter(Home);