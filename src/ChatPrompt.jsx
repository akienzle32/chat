import React from 'react';
import './Chat.css';


function fetchMessages() {
	
	fetch('http://127.0.0.1:8000/chat/', {	
	method: 'GET',
	headers: {
		'If-Modified-Since': new Date(Date.now() - 10000),
	},
	//cache: 'force-cache',
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

//fetchMessages();

setInterval(fetchMessages, 5000);

document.addEventListener('submit', function (event) {

	event.preventDefault();

	let messageForm = event.target;
	let formData = new FormData(messageForm);
	formData.append('author', 'Alec');
	let jsonData = JSON.stringify(Object.fromEntries(formData));



	fetch('http://127.0.0.1:8000/chat/', {
		method: 'POST',
		body: jsonData
	}).then(response => response.json())
	.then(data => {console.log(data);
	})
	document.getElementById('message-form').reset();	
});


export const Prompt = () => {
	return (
		<body>
			<h1 style={{textAlign: 'center'}}>Chat App</h1>	
			<div id="chat-log"></div>
			<div id="lower-box">
				<form id='message-form' >
					<input type="text" id="chat-input" name="content" placeholder="Text message..."></input>
					<input type='submit' value='Send' id='submitButton'></input>
				</form>	
			</div>	
		</body>	
	);
};