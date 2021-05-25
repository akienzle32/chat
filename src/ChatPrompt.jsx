import React from 'react';
import './Chat.css';

var i = 0;
var messageLog = [];

function myInput(enter){
	if (enter.key==='Enter'){
		messageLog[i] = document.getElementById("chat-input").value;
		i++;
 		document.getElementById("chat-input").value = "";

   			var lastMessage = "";   
   			for (var j=0; j < messageLog.length; j++){
     			lastMessage += "<p>" + messageLog[j] + "</p>";
  			}
 			document.getElementById("chat-log").innerHTML = lastMessage;
 			document.getElementById("chat-log").scrollTop = document.getElementById("chat-log").scrollHeight
	}
}

export const Prompt = () => {
	return (
		<body>
			<h1 style={{textAlign: 'center'}}>Chat App</h1>	
			<div id="chat-log"></div>
			<div id="lower-box">
				<input type="text" id="chat-input" onKeyUp={myInput} placeHolder="Text message..."></input>
			</div>	
		</body>	
	);
};