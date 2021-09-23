import React from 'react';
import { ChatList } from './ChatList';

export class StartChat extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      ptcpCounter: 1,
    }
  }


  // Function to pass text input up to App component, where the state of chats and participants 
  // is tracked. 
  onSubmit = (event) => {
    event.preventDefault();

    const chatName = document.getElementById("chat-name").value;
    const ptcpArray = document.getElementsByClassName("ptcp-name");
    const ptcpName = ptcpArray[0].value;
    this.props.onSubmit(chatName, ptcpName);
    document.getElementById("chat-form").reset();
  }


  addParticipants = () => {
    let ptcpCounter = this.state.ptcpCounter;
    if (ptcpCounter < 5)
      ptcpCounter++;
    this.setState({
      ptcpCounter: ptcpCounter,
    })
  }
/*
  displayExtraInput(){
    const maxParticipants = 5;
    const ptcpCounter = this.state.ptcpCounter;
    let extraInput;
    if (ptcpCounter < maxParticipants){
      extraInput = <input type="text" name="username" className="ptcp-name"></input>
    }

    return(extraInput);
  }
 */   

  render() {
  	return(
  	  <div>
		  <h1 id="home-title">Chat App</h1>
			<div className="top-box" id="start-chat">
    	  	  <h3 className="container-title">Start a new chat</h3>
      			<div>
        	  	  <div id="chat-form-container">
        	  		<form id="chat-form" onSubmit={this.onSubmit}>
    			  	    <input type="text" id="chat-name" name="chatname" placeholder="Enter a chatroom name..."></input>
                  <input type="text" className="ptcp-name" name="username" placeholder="Enter a username..."></input>
                  <input type="button" id="add-ptcp-button" value="+" onClick={this.addParticipants}></input>
           		    <input type="submit" id="submit-forms" className="submitButton"></input>
           			</form>
        	   	  </div>
      			</div>
  			</div>
  			<ChatList chats={this.props.chats} participants={this.props.participants} />
  	  </div>
  	);
  }
}