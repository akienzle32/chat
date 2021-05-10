import React from 'react';
const upperBox = {
	height: 200,
	overflowY: 'scroll',
	width: 400,
	border: '7px solid #5F9EA0',
	padding: 50,
	margin: 'auto'
}
const lowerBox = {
	height: 50,
	width: 400,
	paddingTop: 25,
	paddingBottom: 25,
	paddingRight: 50,
	paddingLeft: 50,
	borderBottom: '7px solid #5F9EA0',
	borderLeft: '7px solid #5F9EA0',
	borderRight: '7px solid #5F9EA0',
	margin: 'auto'
}
const currentMessage = {
	height: 20,
	width: 385,
	overflowY: 'scroll', 
	paddingLeft: 5, 
	paddingRight: 5, 
	paddingBottom: 10, 
	paddingTop: 10, 
	margin: 0, 
	border: '2px solid black', 
	borderRadius: 15
}

export const Prompt = () => {
	return (
		<body>
			<h1 style={{textAlign: 'center'}}>Chat App</h1>	
			<div style={upperBox}>
				<p style={{textAlign: 'left'}}>This is where previous messages will appear.</p>
			</div>
			<div style={lowerBox}>
				<div style={currentMessage}>
					This is where current messages will be typed...
				</div>	
			</div>	
		</body>	
	);
};