import React from 'react';
import { Login } from './Login';
import { Home } from './Home';
import { BrowserRouter as Router, Link } from "react-router-dom";

export class App extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
        username: "",
        loggedIn: false,
        token: null,
  	}
    this.baseState = this.state;
  }

  handleErrors(response) {
    if (!response.ok){
      throw Error(response.statusText);
    }
    return(response);
  }

  loginAndSetUser = (username, token) => {
    this.setState({
      username: username,
      loggedIn: true,
      token: 'Token ' + token,
    })
  }

  userLoggedOut = () => {
    this.setState(this.baseState);
  }

  displayNavBar = () => {
    let navBar = null;
    const loggedIn = this.state.loggedIn;
    const username = this.state.username;

    if (loggedIn){
      navBar = 
      <ul className="nav-bar">
        <li className="left-nav-element"><Link className="link" to="/">Home</Link></li>
        <li className="right-nav-element"><button className="link" onClick={this.logoutUser}>Log out</button></li>
        <li className="right-nav-element" id="username">Signed in as <b>{username}</b></li>
      </ul>
    }
    return(navBar);
  }

  // Depending upon authentications status, display either the Login or Home component.
  displayLoginOrHomeComponent = () => {
    let component;
    const { username, loggedIn, token } = this.state;
    if (!loggedIn){
      component = <Login username={username}  token={token} loginAndSetUser={this.loginAndSetUser} 
      handleErrors={this.handleErrors} />
    }
    else {
      component = <Home username={username} loggedIn={loggedIn} token={token} handleErrors={this.handleErrors}  />
    }

    return(component);
  }

  logoutUser = () => {

    fetch('https://alec-chat-api.herokuapp.com/logout', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': this.state.token,
      },
      credentials: 'include',
    })
    .then(this.handleErrors)
    .then(response => {
      if (response.status === 200){
        this.userLoggedOut();
      }
    })
    .catch(error => console.log(error))
  }

  // This initial GET request allows for the user to persist after refreshing the window by asking the 
  // server to send back the user's details, if available. 
  checkLoginStatus = () => {
    fetch('https://alec-chat-api.herokuapp.com/current-user', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
    .then(this.handleErrors)
    .then(response => {
      if (response.status === 200)
        return response.json();
    })
    .then(user => {
      this.setState({
        username: user.username,
        loggedIn: true,
      })
    })
    .catch(error => console.log(error))
  }

  componentDidMount(){
    this.checkLoginStatus();
  }

  render() {
    const navBar = this.displayNavBar();
    const component = this.displayLoginOrHomeComponent();

	  return(
	   <Router>
	  	<div>
        {navBar}
      </div>
      {component}
	  </Router>
	 );
  }
}