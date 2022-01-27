import React from 'react';
import './App.css';

export class ParticipantList extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			displayAddBtn: null,
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

	displayAddPtcpBox = () => {
		this.setState({
			displayAddBtn: "none",
			displayTextBox: null,
		})
	}

	removeAddPtcpBox = () => {
		this.setState({
			displayAddBtn: null,
			displayTextBox: "none",
		})
	}

	toggleAddPtcpBox = () => {
		const displayAddBtn = this.state.displayAddBtn;

		if (displayAddBtn === "none"){
			this.setState({
				displayAddBtn: null,
				displayTextBox: "none",
			})
		}
		else {
			this.setState({
				displayAddBtn: "none",
				displayTextBox: null,
			})
		}
	}

	render() {
		const { displayAddBtn, displayTextBox } = this.state;
		return (
		<div className="main-ptcp-container">
			<div className="main-ptcp-list">
				{this.displayParticipants()}
				<button style={{display: displayAddBtn}} className="main-add-ptcp-btn" onClick={this.toggleAddPtcpBox}>+</button>
				<input style={{display: displayTextBox}} type="text" className="ptcp-text-box" id="ptcp-username" name="name" placeholder="Add participant..."></input>
				<button style={{display: displayTextBox}} className="main-add-ptcp-btn" onClick={this.toggleAddPtcpBox}>x</button>
				<form id="new-ptcp-form" onSubmit={this.onSubmit}>
					<input type="submit" value="Send" className="submit-button"></input>
				</form>
			</div>
		</div>
		);
	}
}

