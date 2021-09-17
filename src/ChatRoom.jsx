import React from 'react';
import './ChatRoom.css';

export class ChatRoom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			loggedIn: false,
		};
		this.bottomOfMessages = React.createRef();
		this.csrftoken = this.getCookie('csrftoken');
	}

	scrollToBottom() {
		this.bottomOfMessages.current.scrollIntoView({behavior: 'smooth'});
	}

	componentDidMount() {
		this.getMessages();
		this.timer = setInterval(this.getMessages, 5000);
		this.scrollToBottom();
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
	
	getMessages = () => {
		fetch('http://127.0.0.1:8000/chat/', {	
			method: 'GET',
			mode: 'cors',
			headers: {
				'If-Modified-Since': new Date(Date.now() - 10000),
				'X-CSRFToken': this.state.csrftoken,
			},
			credentials: 'include',
		})
  		.then(response => {
  		// If the server sends a 401 response because the user is not authenticated, display an alert message prompting
  		// the user to log in.
  			if (response.status === 401){
  				return;
  			}
  		// Otherwise, proceed as normal. 
  			else
  				return response.json();
 		 })
 		 .then(data => {
  			if (data){
  				console.log(data);
  				this.setState({
  					messages: data,
  					loggedIn: true,
  				});
  				// For each message, display the username of the author, the message content itself, and the message's timestamp. 
    		}	
  		});
	}

	componentDidUpdate() {
		this.scrollToBottom()
	}

	// Function to POST new messages to the database. 
	handleSubmit = (event) => {
		this.getCookie('csrftoken');
		event.preventDefault();

		let messageForm = event.target;
		let formData = new FormData(messageForm);
		let jsonData = JSON.stringify(Object.fromEntries(formData));

		fetch('http://127.0.0.1:8000/chat/', {
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
		.then(data => {
			console.log(data);
		})
		document.getElementById('message-form').reset();	
	}

	render() {
		const { messages, loggedIn} = this.state;
		let messageList;

		if (!loggedIn){
			messageList = <p id="login-alert">Please<b>
			<a id="login-link" href='http://127.0.0.1:8000/accounts/login/'> log in</a></b> to receive messages.</p>;
		}
		else {
		  messageList = messages.map(message => {
  			return  <div key={message.id}><p>{ message.author }</p><p id="message">{ message.content }</p>
  					<p id="timestamp">{ message.timestamp }</p></div>
  		  });
  		}
	  	  return (
			<div>
		  	  <div className="upper-container">
			  	<a id="logout" href="http://127.0.0.1:8000/accounts/logout"><b>Log out</b></a>
			  	<h1 className="chat-title">Chat App</h1>
		  	  </div>
		  	  <div className="lower-container">
			  	<div id="ptc-list">
			      <p>Participants:</p>
			  	  <ul>
				  	<li>alec</li>
				  	<li>matt</li>
				  </ul>
			  	</div>
			  	<div id="message-log">{messageList}
			  		<div ref={this.bottomOfMessages} />
			  	</div>
			  	  <div id="lower-box">
					<form id='message-form' onSubmit={this.handleSubmit}>
				  	  <input type="text" id="chat-input" name="content" placeholder="Text message..."></input>
				  	  <input type='hidden' name='author'></input>
				  	  <input type='submit' value='Send' className='submitButton'></input>
					</form>	
			  	</div>
		  	  </div>	
		 	</div>	
	  	  );
	  	}
  	}
