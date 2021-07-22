import React from 'react';
import './Chat.css';

function fetchMessages() {
	
	fetch('http://127.0.0.1:8000/chat/', {	
	method: 'GET',
	headers: {
		'If-Modified-Since': new Date(Date.now() - 10000),
	},
})
  .then(response => 
    response.json())
  .then(data => {
    console.log(data);
  	var messages = data.map(message => {
  		return message.author + '<br><p id=message>' + message.content + '</p><p id=timestamp>' + message.timestamp + '</p>'
  	}).join("");
    document.getElementById('chat-log').innerHTML = messages;
    document.getElementById("chat-log").scrollTop = document.getElementById("chat-log").scrollHeight;
  });
}

setInterval(fetchMessages, 5000);

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
		// If the server returns a redirect, follow the redirect url. At this point, redirects only occur if the user
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
			<a style={{float: 'right'}} href="http://127.0.0.1:8000/accounts/logout"><b>Log out</b></a>
			<h1 style={{textAlign: 'center'}}>Chat App</h1>
			<div id="chat-log"></div>
			<div id="lower-box">
				<form id='message-form' >
					<input type="text" id="chat-input" name="content" placeholder="Text message..."></input>
					<input type='hidden' name='author'></input>
					<input type='submit' value='Send' id='submitButton'></input>
				</form>	
			</div>	
		</body>	
	);
};