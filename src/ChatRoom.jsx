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

	// This method is needed in order to avoid continued GET requests after user navigates away from the page. 
	componentWillUnmount() {
		clearInterval(this.timer);
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

		fetch(`${process.env.REACT_APP_API}/messages/${chatId}`, {	
			method: 'GET',
			mode: 'cors',
			headers: {
				'Authorization': this.props.token
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

	// This method gets called every five seconds after the initial GET request is sent. In contrast to the first
	// request, this one features an 'If-Modified-Since' header, so that the server will only send the resource
	// again if there are new messages. 
	getMessagesOnInterval = () => {
		const url = window.location.href;
		const chatId = this.extractFromUrl(url, 'id');	

		fetch(`${process.env.REACT_APP_API}/messages/${chatId}`, {	
			method: 'GET',
			mode: 'cors',
			headers: {
				'Authorization': this.props.token,
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

	componentDidUpdate() {
		this.displayMessages();
		this.scrollToBottom();
	}

	// Function to POST new messages to the database. 
	onSubmit = (event) => {
		event.preventDefault();

		const url = window.location.href;
		const chatId = this.extractFromUrl(url, 'id');

		let messageForm = event.target;
		let formData = new FormData(messageForm);
		formData.append('chat', chatId);
		let jsonData = JSON.stringify(Object.fromEntries(formData));

		fetch(`${process.env.REACT_APP_API}/messages/${chatId}`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Authorization': this.props.token,
			},
			credentials: 'include',
			body: jsonData
		})
		.then(this.props.handleErrors)
		.then(response => {  
			return response.json();
		})
		.then(newMessage => {
			const messages = this.state.messages; 
			this.setState({
				messages: messages.concat(newMessage),
			})
			this.patchChat();
		})
		.catch(error => console.log(error))
		document.getElementById('message-form').reset();	
	}

	// This method is essentially a request for the server to update the last_modified column of the current
	// chat, and is called every time a message is sent. Because timestamps for messages are added on the
	// server side, the logic for updating this column is entirely located on the backend (which explains why 
	// the PUT request actually features an empty body).
	patchChat = () => {
		const url = window.location.href;
		const chatId = this.extractFromUrl(url, 'id');

		fetch(`${process.env.REACT_APP_API}/chats/${chatId}`, {
			method: 'PUT',
			mode: 'cors',
			headers: {
				'Authorization': this.props.token,
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

		if (loggedIn){
		  messageList = messages.map(message => {
  			return  <div key={message.id} className="message">
				  		<p id="message-author">{ message.author }</p>
				  		<div className="inner-message">
							<p id="message-content">{ message.content }</p>
						</div>
						<p id="message-timestamp">{ message.timestamp }</p>
					  </div>
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
			<div className="main-chat-container">
				<h1 className="main-chat-title">{chatRoomName}</h1>
				<ParticipantList username={this.props.username} participants={this.props.participants} 
				extractFromUrl={this.extractFromUrl} addParticipant={this.props.addParticipant} />
					<div className="message-container">
						<div className="message-log">
							{messages}
							<div ref={this.bottomOfMessages} />
						</div>
						<div className="text-box" id="new-message-box">
							<form id='message-form' onSubmit={this.onSubmit}>
							<input className="text-input" type="text" id="message-input" name="content" placeholder="Text message..."></input>
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