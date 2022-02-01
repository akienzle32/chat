import React from 'react';

export class StartChat extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      ptcpInputBoxes: ["Enter a username... "],
      ptcpNames: [],
      chatName: '',
    }
    this.bottomOfStartChat = React.createRef();
  }
  // Function to pass text input up to the Home component, where the state of chats and participants 
  // is tracked. This function handles arrays of participants in order to support group chats.
  onSubmit = (event) => {
    event.preventDefault();
    const htmlCollection = document.getElementsByClassName("new-chat-input");
    let chatName;
    let ptcpArray = [];

    [...htmlCollection].forEach((element, index) => {
      if (index === 0)
        chatName = element.value;
      else
        ptcpArray.push(element.value);
    })
    
    this.props.onSubmit(chatName, ptcpArray);
    document.getElementById("chat-form").reset();
    this.resetInputFields();
    this.props.toggleChatModalBox();
  }

  resetInputFields = () => {
    this.setState({
      ptcpInputBoxes: ["Enter a username... "],
      ptcpNames: [],
      chatName: '',
    })
  }

  addInputBoxes = () => {
    const ptcpInputBoxes = this.state.ptcpInputBoxes;
    const extraInput = "Add another username... ";
    if (ptcpInputBoxes.length < 5)// I'm limiting group chats to five participants for now. 
      this.setState({
        ptcpInputBoxes: ptcpInputBoxes.concat(extraInput),
    })
  }

  removeInputBoxes = () => {
    const ptcpInputBoxes = this.state.ptcpInputBoxes;
    if (ptcpInputBoxes.length > 1){
      const lastInput = ptcpInputBoxes.length - 1;
      const newInput = ptcpInputBoxes.slice(0, lastInput);
      this.setState({
        ptcpInputBoxes: newInput,
      })  
    }
    const ptcpNames = this.state.ptcpNames;
    ptcpNames.pop();
    this.setState({
      ptcpNames: ptcpNames,
    })
  }

  handlePtcpChange = (event, index) => {
    const prevState = this.state.ptcpNames;
    let nextState = prevState;
    nextState[index] = event.target.value;
    this.setState({
      ptcpNames: nextState,
    })
  }

  handleChatChange = (event) => {
    const chatName = event.target.value;
    this.setState({
      chatName: chatName,
    })
  }

  displayInputBoxes(){
    const ptcpInputBoxes = this.state.ptcpInputBoxes;
    const inputList = ptcpInputBoxes.map((placeholder, index) => {
      return <input key={index} type="text" className="new-chat-input" name="username" placeholder={ placeholder } onChange={(event) => this.handlePtcpChange(event, index)}></input>
    })
    return inputList;
  }

  displaySubPtcpBtn(){
    const ptcpCount = this.state.ptcpInputBoxes.length;
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
    const ptcpInputBoxes = this.displayInputBoxes();
    const subPtcpButton = this.displaySubPtcpBtn();
    const { toggleChatModalBox } = this.props;
    
  	return(
      <div className="inner-modal-box" id="start-chat">
        <button className="close-modal-box-btn" onClick={toggleChatModalBox}>X</button>
        <h3 className="start-chat-title">Start a new chat</h3>
        <div className="chat-form-container">
          <form id="chat-form" onSubmit={this.onSubmit}>
            <div className="chat-input-flexbox">
              <input type="text" className="new-chat-input" id="chat-name" name="chatname" placeholder="Enter a chatroom name..." onChange={this.handleChatChange}></input>
              {ptcpInputBoxes}
              <div className="ptcp-btn-container"><input type="button" className="ptcp-button add" id="add-ptcp-button" value="+"
              onClick={this.addInputBoxes}></input></div>
              {subPtcpButton}
            </div>
            <input type="submit" className="submit-button"></input>
          </form>
          <div ref={this.bottomOfStartChat}></div>
        </div>
      </div>
    );
  }
}