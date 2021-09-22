import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export class ChatRoom extends React.Component {
	constructor(props) {
		super(props);
		console.log(this.props.participants);
		this.state = {
			messages: [],
			loggedIn: false, // Because the backend doesn't support multiple chats yet, I'm tracking authentication state here.
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
		this.getMessages();
		this.timer = setInterval(this.getMessages, 5000);
		this.scrollToBottom();
	}

	// Needed to avoid continued GET requests after user navigates away from page. 
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
	
	getMessages = () => {
		fetch('http://127.0.0.1:8000/chat/', {	
			method: 'GET',
			mode: 'cors',
			headers: {
				//'If-Modified-Since': new Date(Date.now() - 10000),
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
    		}	
  		});
	}

	componentDidUpdate() {
		this.displayMessages();
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
			const newData = this.state.messages.concat(data); // React-recommended way of adding elements to a "stateful" array. 
			this.setState({
				messages: newData,
			})
		})
		document.getElementById('message-form').reset();	
	}

	// If the user is logged in, then for each message, display the username of the author, the message content itself, 
	// and the message's timestamp. This method is called by both componentDidMount() and componentDidUpdate(). 
	displayMessages() {
		const { messages, loggedIn } = this.state;
		let messageList;

		if (!loggedIn){
			messageList = <p id="login-alert">Please<b>
			<a className="link" id="login-link" href='http://127.0.0.1:8000/accounts/login/'> log in </a></b> to receive messages.</p>;
		}
		else {
		  messageList = messages.map(message => {
  			return  <div key={message.id}><p>{ message.author }</p><p id="message">{ message.content }</p>
  					<p id="timestamp">{ message.timestamp }</p></div>
  		  });
  		}
  		return messageList;
	}

	render() {
	  	  return (
			<div>
			  <div className="nav-bar">
  				<Link className="link" to="/">Home</Link>
	  			<a className="link" id="logout" href="http://127.0.0.1:8000/accounts/logout">Log out</a>
	  		  </div>
		  	  <div><h1 className="chat-title">Chat Room</h1></div>
		  	  <div className="lower-container">
			  	<div id="ptc-list">
			      <p>Participants:</p>
			  	  <ul>
				  	<li>alec</li>
				  	<li>matt</li>
				  </ul>
			  	</div>
			  	<div className="top-box" id="message-log">{this.displayMessages()}
			  	  <div ref={this.bottomOfMessages} />
			  	</div>
			  	  <div className="bottom-box" id="new-messages">
					<form id='message-form' onSubmit={this.handleSubmit}>
				  	  <input type="text" id="message-input" name="content" placeholder="Text message..."></input>
				  	  <input type='hidden' name='author'></input>
				  	  <input type='submit' value='Send' className='submitButton'></input>
					</form>	
			  	</div>
		  	  </div>	
		 	</div>	
	  	  );
	  	}
  	}

