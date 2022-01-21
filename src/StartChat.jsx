import React from 'react';

export class StartChat extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      ptcpInput: ["Enter a username... "],
    }
    this.baseState = this.state; // Record the base state in order to revert to it after form submission.
    this.bottomOfStartChat = React.createRef();
  }
  // Function to pass text input up to the Home component, where the state of chats and participants 
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
    this.setState(this.baseState);
  }

  addInputBoxes = () => {
    const ptcpInput = this.state.ptcpInput;
    const extraInput = "Add another username... ";
    if (ptcpInput.length < 5)// I'm limiting group chats to five participants for now. 
      this.setState({
        ptcpInput: ptcpInput.concat(extraInput),
    })
  }

  removeInputBoxes = () => {
    const ptcpInput = this.state.ptcpInput;
    if (ptcpInput.length > 1){
      const lastInput = ptcpInput.length - 1;
      const newInput = ptcpInput.slice(0, lastInput);
      this.setState({
        ptcpInput: newInput,
      })
    }
  }

  displayInputBoxes(){
    const ptcpInput = this.state.ptcpInput;
    const inputList = ptcpInput.map((placeholder, index) => {
      return <input key={index} type="text" className="ptcp-name" name="username" placeholder={ placeholder }></input>
    })
    return(inputList);
  }

  scrollToBottom(){
    this.bottomOfStartChat.current.scrollIntoView();
  }

  componentDidMount(){
    this.displayInputBoxes();
  }

  componentDidUpdate(){
    this.displayInputBoxes();
    this.scrollToBottom();
  }

  render() {
    const ptcpInput = this.state.ptcpInput;
    const ptcpInputFields = this.displayInputBoxes();
    let subPtcpButton;
    if (ptcpInput.length > 1)
      subPtcpButton = <input type="button" className="ptcp-button sub" id="sub-ptcp-button" value="–" onClick={this.removeInputBoxes}></input>;
    else
      subPtcpButton = <input style={{visibility: "hidden"}} type="button" className="ptcp-button" id="sub-ptcp-button"></input>;

    const { username, chats, participants, toggleChatModalBox } = this.props;
  	return(
        <div className="inner-modal-box" id="start-chat">
          <button className="close-modal-box-btn" onClick={toggleChatModalBox}>X</button>
          <h3 className="start-chat-title">Start a new chat</h3>
          <div className="chat-form-container">
            <form id="chat-form" onSubmit={this.onSubmit}>
              <div className="chat-input-flexbox">
                <input type="text" id="chat-name" name="chatname" placeholder="Enter a chatroom name..."></input>
                {ptcpInputFields}
              </div>
              {subPtcpButton}
              <input type="button" className="ptcp-button add" id="add-ptcp-button" value="+" 
                onClick={this.addInputBoxes} ref={this.bottomOfStartChat}></input>
              <input type="submit" className="submit-button"></input>
            </form>
          </div>
        </div>
    );
  }
}