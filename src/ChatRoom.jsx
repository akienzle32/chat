import React from 'react';
import { ParticipantList } from './ParticipantList';
import './App.css';


export class ChatRoom extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			messages: [],
		};
		this.bottomOfMessages = React.createRef();
		this.csrftoken = this.getCookie('csrftoken');
	}

	// Function to scroll the message-log div to the bottom. It is called by both componentDidMount() and componentDidUpdate(). 
	scrollToBottom() {
		this.bottomOfMessages.current.scrollIntoView({behavior: 'smooth'});
	}

	// Load messages with the page, and ping the server once every five seconds for new messages after initial page load.  
	componentDidMount() {
		this.initGetMessages();
		this.timer = setInterval(this.getMessagesOnInterval, 5000);
		this.scrollToBottom();
	}

	// This method is needed in order to avoid continued GET requests after user navigates away from page. 
	componentWillUnmount() {
		clearInterval(this.timer);
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

	// Function to extract either the chat name or the chat id from the url.
	extractFromUrl(url, string) {
		const cleanUrl = decodeURI(url);
		const pathArray = cleanUrl.split('/');
		let urlElement;
		switch(string){
			case 'name':
				urlElement = pathArray[3];
				break;
			case 'id':
				urlElement = pathArray[4];
				break;
			default:
				urlElement = null;
    	}
    	return urlElement;
	}

	initGetMessages = () => {
		const url = window.location.href;
		const chatId = this.extractFromUrl(url, 'id');

		fetch('http://127.0.0.1:8000/chat/messages/' + chatId, {	
			method: 'GET',
			mode: 'cors',
			credentials: 'include',
		})
		.then(this.props.handleErrors)
  		.then(response => {
  			return response.json();
 		 })
 		 .then(messages => {
  			if (messages){
  				this.setState({
  					messages: messages,
  				});
    		}	
  		})
 		.catch(error => console.log(error))
	}

	// This method gets called every five seconds after the initial GET request is sent. In contrast to the first
	// request, this one features an 'If-Modified-Since' header, so that the server will only send the resource
	// again if there are new messages. 
	getMessagesOnInterval = () => {
		const url = window.location.href;
		const chatId = this.extractFromUrl(url, 'id');	

		fetch('http://127.0.0.1:8000/chat/messages/' + chatId, {	
			method: 'GET',
			mode: 'cors',
			headers: {
				'If-Modified-Since': new Date(Date.now() - 10000),
			},
			credentials: 'include',
		})
		.then(this.props.handleErrors)
  		.then(response => {
  			return response.json();
 		 })
 		 .then(messages => {
  			if (messages){
  				this.setState({
  					messages: messages,
  				});
    		}	
  		})
 		.catch(error => console.log(error))
	}

	loggedIn = () => {
		this.props.userLoggedIn();
	}

	componentDidUpdate() {
		this.displayMessages();
		this.scrollToBottom()
	}

	// Function to POST new messages to the database. 
	handleSubmit = (event) => {
		this.getCookie('csrftoken');
		event.preventDefault();

		const url = window.location.href;
		const chatId = this.extractFromUrl(url, 'id');

		let messageForm = event.target;
		let formData = new FormData(messageForm);
		formData.append('chat', chatId);
		let jsonData = JSON.stringify(Object.fromEntries(formData));

		fetch('http://127.0.0.1:8000/chat/messages/' + chatId, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'X-CSRFToken': this.csrftoken,
			},
			credentials: 'include',
			body: jsonData
		})
		.then(response => {
			// If the server returns a redirect, follow the redirect url. A redirect will occur if the user
			// attempts to send a message but isn't logged in.  
			if (response.redirected){
				window.location.href = response.url;
				return;
			} 
			else 
				return response.json();
		})
		.then(newMessage => {
			const messages = this.state.messages; 
			this.setState({
				messages: messages.concat(newMessage),
			})
			this.patchChat();
		})
		document.getElementById('message-form').reset();	
	}

	// This method is essentially a request for the server to update the last_modified column of the current
	// chat, and is called every time a message is sent. Because timestamps for messages are added on the
	// server side, the logic for updating this column is entirely located on the server (which explains why 
	// the PUT request actually features an empty body).
	patchChat = () => {
		const url = window.location.href;
		const chatId = this.extractFromUrl(url, 'id');

		fetch('http://127.0.0.1:8000/chat/chats/' + chatId, {
			method: 'PUT',
			mode: 'cors',
			headers: {
				'X-CSRFToken': this.csrftoken,
			},
			credentials: 'include',
		})
		.then(this.props.handleErrors)
		.then(response => {
			return response.json()
		})
		.then(chat => {
			this.props.updateChatState(chat);
		})
		.catch(error => console.log(error))
	}

	// If the user is logged in, then for each message, display the username of the author, the message content itself, 
	// and the message's timestamp. This method is called by both componentDidMount() and componentDidUpdate(). 
	displayMessages() {
		const messages = this.state.messages;
		const loggedIn = this.props.loggedIn;
		let messageList;

		if (!loggedIn){
			messageList = <p id="login-alert">Please<b>
			<a className="link" id="login-link" href='http://127.0.0.1:8000/accounts/login/'> log in </a></b> to receive messages.</p>;
		}
		else {
		  messageList = messages.map(message => {
  			return  <div key={message.id}><p id="author-par">{ message.author }</p><p id="message">{ message.content }</p>
  					<p id="timestamp">{ message.timestamp }</p></div>
  		  });
  		}
  		return messageList;
	}

	// Scrape the chat room name from the url. 
	displayChatRoomName(){
		const url = window.location.href;
		const chatName = this.extractFromUrl(url, 'name');
		const decodedChatName = decodeURIComponent(chatName);

		return(decodedChatName);
	}

	render() {
		const chatRoomName = this.displayChatRoomName();
		const messages = this.displayMessages();
	  	  return (
			<div>
		  	  <div><h1 className="chat-title">{chatRoomName}</h1></div>
		  	  <div className="lower-container">
		  	  	<ParticipantList username={this.props.username} participants={this.props.participants} 
		  	  		extractFromUrl={this.extractFromUrl} addParticipant={this.props.addParticipant} />
			  	<div className="top-box" id="message-log">{messages}
			  	  <div ref={this.bottomOfMessages} />
			  	</div>
			  	  <div className="bottom-box" id="new-messages">
					<form id='message-form' onSubmit={this.handleSubmit}>
				  	  <input type="text" id="message-input" name="content" placeholder="Text message..."></input>
				  	  <input type='hidden' name='author'></input>
				  	  <input type='hidden' name='chat'></input>
				  	  <input type='submit' value='Send' className='submit-button'></input>
					</form>	
			  	</div>
		  	  </div>	
		 	</div>	
	  	  );
	  	}
  	}

