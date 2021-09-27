import React from 'react';
import { ChatList } from './ChatList';

export class StartChat extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      input: ["Enter a username... "],
    }
  }

  // Function to pass text input up to App component, where the state of chats and participants 
  // is tracked. This function handles arrays of participants in order to support group chats.
  onSubmit = (event) => {
    event.preventDefault();

    const chatName = document.getElementById("chat-name").value;
    const htmlArray = document.getElementsByClassName("ptcp-name");
    let ptcpArray = [];

    for (let i = 0; i < htmlArray.length; i++){
      const ptcpName = htmlArray[i].value;
      ptcpArray.push(ptcpName);
    }

    this.props.onSubmit(chatName, ptcpArray);
    document.getElementById("chat-form").reset();
  }

  // Function for adding additional participants for a group chat. I'm limiting group chats to five
  // participants for now. 
  addParticipants = () => {
    const input = this.state.input;
    const extraInput = "Add another username... ";
    if (input.length < 5)
      this.setState({
        input: input.concat(extraInput),
    })
  }

  displayInputBoxes(){
    const input = this.state.input;
    const inputList = input.map((placeholder, index) => {
      return <input key={index} type="text" className="ptcp-name" name="username" placeholder={ placeholder }></input>
    })
    return(inputList);
  }

  componentDidMount(){
    this.displayInputBoxes();
  }

  componentDidUpdate(){
    this.displayInputBoxes();
  }

  render() {
    const { username, chats, participants } = this.props;
  	return(
  	  <div>
		  <h1 id="home-title">Chat App</h1>
			<div className="top-box" id="start-chat">
    	  	  <h3 className="container-title">Start a new chat</h3>
      			<div id="form-container">
        	  	<form id="chat-form" onSubmit={this.onSubmit}>
                <div>
    			  	    <input type="text" id="chat-name" name="chatname" placeholder="Enter a chatroom name..."></input>
                  <input type="button" id="add-ptcp-button" value="+" onClick={this.addParticipants}></input>
                  {this.displayInputBoxes()}
           		    <input type="submit" id="submit-forms" className="submitButton"></input>
                </div>
           		</form>
      			</div>
  			</div>
  			<ChatList username={username} chats={chats} participants={participants} />
  	  </div>
  	);
  }
}