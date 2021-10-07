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
		const participantArray = [];

		const url = window.location.href;
		const chatId = parseInt(props.extractFromUrl(url, 'id'));

		for (let i = 0; i < participants.length; i++){
			if (participants[i].chat === chatId){
				let ptcpName = participants[i].name;
				if (ptcpName === currentUser)
					ptcpName = "me"; // In each individual chatroom, display the current user as "me"

				participantArray.push(ptcpName);
			}
		}
		const ptcpList = participantArray.map((participant, index) => {return <li key={index}>{ participant }</li>})
		return(ptcpList);
	}
	return (
	  <div id="ptcp-list">
		<p>Participants</p>
		  <ul>{displayParticipants()}</ul>
			<form id="new-ptcp-form" onSubmit={onSubmit}>
			  <input type="text" id="ptcp-username" name="name" placeholder="Add participant..."></input>
			  <input type="submit" value="Send" className="submit-button"></input>
			</form>
	  </div>
	);
}

