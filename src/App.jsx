import React from 'react';
import { Login } from './Login';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

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

  displayNavBar = () => {
    let navBar;
    const loggedIn = this.state.loggedIn;
    const username = this.state.username;

    if (loggedIn){
      navBar = 
        <nav className="nav-bar">
          <Link className="logo" to="/">CHAT APP</Link>
          <ul className="nav-links">
            <li className="nav-item username" id="username">Signed in as: <b>{username}</b></li>
            <li className="nav-item logout"><button className="logout-btn" onClick={this.logoutUser}>Log out</button></li>
          </ul>
        </nav>
    }
    return(navBar);
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

  // Depending upon the user's authentication status, display either the Login or Home component.
  displayLoginOrHomeComponent = () => {
    let component;
    const { username, loggedIn, token } = this.state;
    if (!loggedIn){
      component = <Login username={username}  token={token} loginAndSetUser={this.loginAndSetUser} 
      handleErrors={this.handleErrors} />
    }
    else {
      component = 
      <Switch>
        <Route path="/">
          <Home username={username} loggedIn={loggedIn} token={token} handleErrors={this.handleErrors}  />
        </Route>
      </Switch>
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

  componentDidMount() {
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