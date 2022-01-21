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
    const ptcpCount = this.state.ptcpCount;
    if (ptcpInput.length < 5)// I'm limiting group chats to five participants for now. 
      this.setState({
        ptcpInput: ptcpInput.concat(extraInput),
        ptcpCount: ptcpCount+1,
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
      return <input key={index} type="text" className="new-chat-input" name="username" placeholder={ placeholder }></input>
    })
    return(inputList);
  }

  displaySubPtcpBtn(){
    const ptcpCount = this.state.ptcpInput.length;
    const display = ptcpCount > 1 ? null : "none";
    const subPtcpButton = <input style={{display: display}} type="button" className="ptcp-button sub" id="sub-ptcp-button" value="–" onClick={this.removeInputBoxes}></input>;

    return subPtcpButton;
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
    const ptcpInputFields = this.displayInputBoxes();
    const subPtcpButton = this.displaySubPtcpBtn();
    const { toggleChatModalBox } = this.props;
    
  	return(
        <div className="inner-modal-box" id="start-chat">
          <button className="close-modal-box-btn" onClick={toggleChatModalBox}>X</button>
          <h3 className="start-chat-title">Start a new chat</h3>
          <div className="chat-form-container">
            <form id="chat-form" onSubmit={this.onSubmit}>
              <div className="chat-input-flexbox">
                <input type="text" className="new-chat-input" id="chat-name" name="chatname" placeholder="Enter a chatroom name..."></input>
                {ptcpInputFields}
              </div>
                {subPtcpButton}
              <input type="button" className="ptcp-button add" id="add-ptcp-button" value="+" 
                onClick={this.addInputBoxes}></input>
              <input type="submit" className="submit-button"></input>
            </form>
            <div ref={this.bottomOfStartChat}></div>
          </div>
        </div>
    );
  }
}