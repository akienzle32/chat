import React from 'react';
import './App.css';

export class ParticipantList extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			displayTextBox: false,
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

	displayBtnOrTextBox = () => {
		let htmlNode;
		const displayTextBox = this.state.displayTextBox;

		if (displayTextBox){
			htmlNode = <input type="text" className="ptcp-text-box" id="ptcp-username" name="name" placeholder="Add participant..."></input>;
		}
		else {
			htmlNode = <button className="main-add-ptcp-btn" onClick={this.toggleDisplayTextBox}>+</button>;
		}
		return htmlNode;
	}

	displayCancelBtn = () => {
		let cancelBtn;
		const displayTextBox = this.state.displayTextBox;

		if (displayTextBox){
			cancelBtn = <button className="remove-ptcp-box-btn" onClick={this.toggleDisplayTextBox}>X</button>;
		}
		return cancelBtn;
	}

	toggleDisplayTextBox = () => {
		const oldDisplayTextBox = this.state.displayTextBox;

		this.setState({
				displayTextBox: oldDisplayTextBox ? false : true,
		})
	}

	render() {
		return (
		<div className="main-ptcp-container">
			<div className="main-ptcp-list">{this.displayParticipants()}</div>
			<form id="new-ptcp-form" onSubmit={this.onSubmit}>
				{this.displayBtnOrTextBox()}
			</form>
				{this.displayCancelBtn()}
		</div>
		);
	}
}

