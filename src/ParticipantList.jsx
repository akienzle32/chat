import React from 'react';
import './App.css';

export class ParticipantList extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			displayAddButton: null,
			displayTextBox: "none",
		};
	}

	onSubmit = (event) => {
		event.preventDefault();

		const ptcpName = document.getElementById("ptcp-username").value;
		const url = window.location.href;
		const chatId = this.props.extractFromUrl(url, 'id');

		this.props.addParticipant(ptcpName, chatId);
		document.getElementById("new-ptcp-form").reset();
	}

	displayParticipants = () => {
		const currentUser = this.props.username;
		const participants = this.props.participants;

		const url = window.location.href;
		const chatId = parseInt(this.props.extractFromUrl(url, 'id'));

		const participantArray = participants.reduce((prevVal, currVal) => {
			if (currVal.chat === chatId && currVal.name !== currentUser){
				prevVal.push(currVal.name);
			}
			return prevVal;
		}, [])
		const ptcpList = participantArray.join(', ');
		return(ptcpList);
	}

	onClick = () => {
		this.setState({
			displayAddButton: "none",
			displayTextBox: null,
		})
	}

	render() {
		const { displayAddButton, displayTextBox } = this.state;
		return (
		<div className="main-ptcp-container">
			<div className="main-ptcp-list">
				{this.displayParticipants()}
				<button style={{display: displayAddButton}} className="main-add-ptcp-btn" onClick={this.onClick}>+</button>
				<input style={{display: displayTextBox}} type="text" className="ptcp-text-box" id="ptcp-username" name="name" placeholder="Add participant..."></input>
				<form id="new-ptcp-form" onSubmit={this.onSubmit}>
					<input type="submit" value="Send" className="submit-button"></input>
				</form>
			</div>
		</div>
		);
	}
}

