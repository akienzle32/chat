import React from 'react';
const pastMessages = {
	height: 100,
	overflowY: 'scroll',
	width: 300,
	border: '10px solid #5F9EA0',
	padding: 75,
	margin: 'auto'
}
const currentMessage = {
	height: 50,
	overflowY: 'scroll',
	width: 300,
	paddingTop: 25,
	paddingBottom: 25,
	paddingRight: 75,
	paddingLeft: 75,
	borderBottom: '10px solid #5F9EA0',
	borderLeft: '10px solid #5F9EA0',
	borderRight: '10px solid #5F9EA0',
	margin: 'auto'
}

export const Prompt = () => {
	return (
		<body>
			<h1 style={{textAlign: 'center'}}>Chat App</h1>	
			<div style={pastMessages}>
				<p style={{textAlign: 'left'}}>This is where previous messages will be seen. I'm going to type
				more words in order to see if the scroll function is working properly. It does indeed appear to work.</p>
			</div>
			<div style={currentMessage}>
				<p style={{textAlign: 'left'}}>Prompt</p>
			</div>	
		</body>	
	);
};