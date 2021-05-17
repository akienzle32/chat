import React from 'react';

const upperBox = {
	backgroundColor: '#FDF5E6',
	height: 200,
	overflowY: 'scroll',
	width: 400,
	borderRadius: 25,
	border: '7px solid #5F9EA0',
	padding: 50,
	margin: 'auto'
}
const lowerBox = {
	backgroundColor: '#FDF5E6',
	height: 50,
	width: 400,
	paddingTop: 25,
	paddingBottom: 25,
	paddingRight: 50,
	paddingLeft: 50,
	borderRadius: 25,
	borderBottom: '7px solid #5F9EA0',
	borderLeft: '7px solid #5F9EA0',
	borderRight: '7px solid #5F9EA0',
	margin: 'auto'
}
const currentMessage = {
	backgroundColor: 'white',
	height: 20,
	width: 385,
	overflowY: 'scroll', 
	paddingLeft: 5, 
	paddingRight: 5, 
	paddingBottom: 10, 
	paddingTop: 10, 
	margin: 0, 
	fontSize: 16
}

var i = 0;
var messageLog = Array();

function myInput(){
 messageLog[i] = document.getElementById("chat-input").value;
 i++;
 document.getElementById("chat-input").value = "";

   var lastMessage = "";   
   for (var j=0; j < messageLog.length; j++)
   {
     lastMessage += messageLog[j] + "<br/><br/>";
   }
 	document.getElementById("chat-log").innerHTML = lastMessage;
}

export const Prompt = () => {
	return (
		<body>
			<h1 style={{textAlign: 'center'}}>Chat App</h1>	
			<div style={upperBox}>
				<div id="chat-log"></div>
			</div>
			<div style={lowerBox}>
				<input type="text" id="chat-input" style={currentMessage} placeHolder="Text message..."></input>
				<button id="submit-btn" onClick={myInput}>Submit</button>
			</div>	
		</body>	
	);
};