import React from 'react';
const pastMessages = {
	width: 300,
	border: '10px solid #5F9EA0',
	padding: 100,
	margin: 'auto'
}
const currentMessage = {
	width: 300,
	paddingTop: 25,
	paddingBottom: 25,
	paddingRight: 100,
	paddingLeft: 100,
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
				<p style={{textAlign: 'center'}}>This is where previous messages will be seen.</p>
			</div>
			<div style={currentMessage}>
				<p style={{textAlign: 'center'}}>Prompt</p>
			</div>	
		</body>	
	);
};