import React from 'react';
import './Chat.css';


function fetchMessages() {fetch('http://127.0.0.1:8000/chat/', {
	method: 'GET',
	headers: {
		'If-Modified-Since': 'Wed, 20 May 2021 5:58:00 GMT'
	},
})
  .then(response => 
    response.json())
  .then(data => {
    console.log(data);
    //maybe add each incoming message to an array, only posting messages with a unique id
    // or use if-None-Match
    var messageLog = data.map(message => {
      return '<p>' + message.content + '</p>'
    }).join("");
    document.getElementById('chat-log').insertAdjacentHTML('afterbegin', messageLog);
  });
}

fetchMessages()

//setInterval(fetchMessages, 5000);

document.addEventListener('submit', function (event) {

	event.preventDefault();

	let messageForm = event.target;
	let formData = new FormData(messageForm);

	formData.append('author', 'alec')

	fetch('http://127.0.0.1:8000/chat/', {
		method: 'POST',
		body: formData,
	}).then(response => response.json())
	.then(data => {console.log(data);
	})
	document.getElementById('message-form').reset();
	//document.getElementById('chat-log').scrollTop = document.getElementById('chat-log').scrollHeight		
});


export const Prompt = () => {
	return (
		<body>
			<h1 style={{textAlign: 'center'}}>Chat App</h1>	
			<div id="chat-log"></div>
			<div id="lower-box">
				<form id='message-form' >
					<input type="text" id="chat-input" name="content" placeholder="Text message..."></input>
					<input type='submit' value='Submit'></input>
				</form>	
			</div>	
		</body>	
	);
};