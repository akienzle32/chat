import React from 'react';
import './App.css';

export const ParticipantList = (props) => {

	const onSubmit = (event) => {
		event.preventDefault();

		const ptcpName = document.getElementById("ptcp-username").value;
		const url = window.location.href;
		const chatId = props.extractFromUrl(url, 'id');

		props.addParticipant(ptcpName, chatId);
		document.getElementById("new-ptcp-form").reset();
	}

	const displayParticipants = () => {
		const currentUser = props.username;
		const participants = props.participants;

		const url = window.location.href;
		const chatId = parseInt(props.extractFromUrl(url, 'id'));

		const participantArray = participants.reduce((prevVal, currVal) => {
			if (currVal.chat === chatId && currVal.name !== currentUser){
				prevVal.push(currVal.name);
			}
			return prevVal;
		}, [])
		const ptcpList = participantArray.join(', ');
		return(ptcpList);
	}
	return (
	  <div id="ptcp-list">
		{displayParticipants()}
		<form id="new-ptcp-form" onSubmit={onSubmit}>
			<input type="text" id="ptcp-username" name="name" placeholder="Add participant..."></input>
			<input type="submit" value="Send" className="submit-button"></input>
		</form>
	  </div>
	);
}

