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

/*
  userLoggedOut = () => {
    this.setState(this.baseState);
  }
*/

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

  // Depending upon the user's authentication status, display either the Login or Home component.
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
    window.localStorage.clear();
    this.setState(this.baseState);
  }

  // This initial GET request allows for the user to persist after refreshing the window by checking 
  // to see if the user's details are currently stored. 
  checkLoginStatus = () => {
    const username = window.localStorage.getItem('username');
    const token = window.localStorage.getItem('token');

    if (username && token){
      this.loginAndSetUser(username, token);
    }
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