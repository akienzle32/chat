import React from 'react';
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

	initGetMessages = () => {
		const path = window.location.pathname;
		const pathArray = path.split('/');
		const chatId = pathArray[2];	

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
  				console.log(messages);
  				this.setState({
  					messages: messages,
  				});
    		}	
  		})
 		.catch(error => console.log(error))
	}

	
	getMessagesOnInterval = () => {
		const path = window.location.pathname;
		const pathArray = path.split('/');
		const chatId = pathArray[2];	

		fetch('http://127.0.0.1:8000/chat/messages/' + chatId, {	
			method: 'GET',
			mode: 'cors',
			headers: {
				// For this initial testing phase, I'm getting rid of conditional GET requests.
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
  				console.log(messages);
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

		const path = window.location.pathname;
		const pathArray = path.split('/');
		const chatId = pathArray[2];
		console.log(chatId);

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
			console.log(newMessage);
			const messages = this.state.messages; // React-recommended way of adding elements to a "stateful" array. 
			this.setState({
				messages: messages.concat(newMessage),
			})
		})
		document.getElementById('message-form').reset();	
	}

	addParticipant = (event) => {
		event.preventDefault();

		const ptcpName = document.getElementById("ptcp-username").value;
		const path = window.location.pathname;
		const pathArray = path.split('/');
		const chatId = parseInt(pathArray[2]);

		this.props.addParticipant(ptcpName, chatId);
		document.getElementById("new-ptcp-form").reset();
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

	displayParticipants(){
		const currentUser = this.props.username;
		const participants = this.props.participants;
		const participantArray = [];

		const path = window.location.pathname;
		const pathArray = path.split('/');
		const chatId = parseInt(pathArray[2]);

		for (let i = 0; i < participants.length; i++){
			if (participants[i].chat === chatId){
				let ptcpName = participants[i].name;
				if (ptcpName === currentUser)
					ptcpName = "me"; // In each individual chatroom, display the current user as "me"

				participantArray.push(ptcpName);
			}
		}
		const ptcpList = participantArray.map((participant, index) => {return <li key={index}>{ participant }</li>})
		return(ptcpList);
	}

	// Scrape the chat room name from the url. 
	displayChatRoomName(){
		const url = window.location.href;
		const cleanUrl = decodeURI(url);
		const pathArray = cleanUrl.split('/');
		const chatName = pathArray[3];

		return(chatName);
	}

	render() {
		const chatRoomName = this.displayChatRoomName();
		const messages = this.displayMessages();
		const participants = this.displayParticipants();
	  	  return (
			<div>
		  	  <div><h1 className="chat-title">{chatRoomName}</h1></div>
		  	  <div className="lower-container">
			  	<div id="ptc-list">
			      <p>Participants:</p>
			  	  <ul>{participants}</ul>
			  	  <form id="new-ptcp-form" onSubmit={this.addParticipant}>
			  	  	<input type="text" id="ptcp-username" name="name" placeholder="Add participant..."></input>
			  	  	<input type="submit" value="Send" className="submitButton"></input>
			  	  </form>
			  	</div>
			  	<div className="top-box" id="message-log">{messages}
			  	  <div ref={this.bottomOfMessages} />
			  	</div>
			  	  <div className="bottom-box" id="new-messages">
					<form id='message-form' onSubmit={this.handleSubmit}>
				  	  <input type="text" id="message-input" name="content" placeholder="Text message..."></input>
				  	  <input type='hidden' name='author'></input>
				  	  <input type='hidden' name='chat'></input>
				  	  <input type='submit' value='Send' className='submitButton'></input>
					</form>	
			  	</div>
		  	  </div>	
		 	</div>	
	  	  );
	  	}
  	}

