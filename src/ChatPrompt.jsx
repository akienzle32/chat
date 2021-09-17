import React from 'react';
import './ChatPrompt.css';

// Function provided by Django for adding csrf tokens to AJAX requests; see https://docs.djangoproject.com/en/3.2/ref/csrf/ for details.
function getCookie(name) {
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

const csrftoken = getCookie('csrftoken');

// Send GET request to retrieve messages in database. 
function fetchMessages() {
	
	fetch('http://127.0.0.1:8000/chat/', {	
	method: 'GET',
	mode: 'cors',
	headers: {
		'If-Modified-Since': new Date(Date.now() - 10000),
		'X-CSRFToken': csrftoken,
	},
	credentials: 'include',
})
  .then(response => {
  	// If the server sends a 401 response because the user is not authenticated, display an alert message prompting
  	// the user to log in.
  	if (response.status === 401){
  		document.getElementById("message-log").innerHTML = '<p id=login-alert>Please ' + 
  		'<b><a id=login-link href=http://127.0.0.1:8000/accounts/login/>log in</a></b> to receive messages.</p>';
  		return;
  	}
  	// Otherwise, proceed as normal. 
  	else
  		return response.json();
  })
  .then(data => {
  	if (data){
  		console.log(data);
  		// For each message, display the username of the author, the message content itself, and the message's timestamp. 
  		var messages = data.map(message => {
  			return message.author + '<br><p id=message>' + message.content + '</p><p id=timestamp>' + message.timestamp + '</p>'
  			}).join("");
  		const chatLog = document.getElementById("message-log");
  		chatLog.innerHTML = messages;
  		chatLog.scrollTop = chatLog.scrollHeight;
    }	
  });
}

// Fetch the messages once when the page loads, and then ping the server every five seconds to see if new 
// new messages are available. 
window.onload = fetchMessages;
setInterval(fetchMessages, 5000);

// Function to POST new messages to the database. 
document.addEventListener('submit', function (event) {

	event.preventDefault();

	let messageForm = event.target;
	let formData = new FormData(messageForm);
	let jsonData = JSON.stringify(Object.fromEntries(formData));

	fetch('http://127.0.0.1:8000/chat/', {
		method: 'POST',
		mode: 'cors',
		headers: {
			'X-CSRFToken': csrftoken
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
			response.json()
	})
	.then(data => {console.log(data);
	})
	document.getElementById('message-form').reset();	
});


export const Prompt = () => {
	return (
		<body>
			<div class="upper-container">
				<a id="logout" href="http://127.0.0.1:8000/accounts/logout"><b>Log out</b></a>
				<h1 class="chat-title">Chat App</h1>
			</div>
				<div class="lower-container">
			  		<div id="ptc-list">
			  			<p>Participants:</p>
			  			<ul>
				  			<li>alec</li>
				  			<li>matt</li>
						</ul>
			  		</div>
			<div id="message-log"></div>
			<div id="lower-box">
				<form id='message-form' >
					<input type="text" id="chat-input" name="content" placeholder="Text message..."></input>
					<input type='hidden' name='author'></input>
					<input type='submit' value='Send' class='submitButton'></input>
				</form>	
			</div>
		  </div>	
		</body>	
	);
};