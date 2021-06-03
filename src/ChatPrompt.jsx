import React from 'react';
import './Chat.css';


document.addEventListener('submit', function (event) {

	event.preventDefault();

	let myForm = event.target;
	let formData = new FormData(myForm);

	formData.append('author', 'alec')

	fetch('http://127.0.0.1:8000/chat/', {
		method: 'POST',
		body: formData,
	}).then(response => response.json())
	.then(data => console.log(data));
});

export const Prompt = () => {
	return (
		<body>
			<h1 style={{textAlign: 'center'}}>Chat App</h1>	
			<div id="chat-log"></div>
			<div id="lower-box">
				<form id='message-form' >
					<input type="text" id="chat-input" name="content" placeHolder="Text message..."></input>
					<input type='submit' value='Submit'></input>
				</form>	
			</div>	
		</body>	
	);
};