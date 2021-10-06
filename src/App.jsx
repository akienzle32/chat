import React from 'react';
import { Login } from './Login';
import { Logout } from './Logout';
import { Home } from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, } from "react-router-dom";

export class App extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		username: "",
      loggedIn: false,
  	}
    this.baseState = this.state;
  }

  setUser = (username) => {
    this.setState({
      username: username,
    })
  }

  userLoggedIn = () => {
    this.setState({loggedIn: true});
  }

  userLoggedOut = () => {
    this.setState(this.baseState);
  }

  displayLoginOrLogout(){
    let navButton;
    const loggedIn = this.state.loggedIn;
    if (loggedIn)
      navButton = <li className="right-nav-element"><Link className="link" to="/logout">Log out</Link></li>;
    else
      navButton = <li className="right-nav-element"><Link className="link" to="/">Login</Link></li>;

    return(navButton);
  }

  displayLoginOrHomeComponent(){
    let component;
    const { username, csrftoken, loggedIn } = this.state;
    if (!loggedIn){
      component = <Login csrftoken={csrftoken} username={username} userLoggedIn={this.userLoggedIn} setUser={this.setUser} />
    }
    else {
      component = <Home username={username} csrftoken={csrftoken} loggedIn={loggedIn}  />
    }

    return(component);
  }


  displayUsername(){
    let usernameIcon;
    const username = this.state.username;
    if (username)
      usernameIcon = <li className="right-nav-element" id="username">Signed in as <b>{username}</b></li>
    else
      usernameIcon = <li className = "right-nav-element" id="username"></li>
    return(usernameIcon);
  }

  
  render() {
    const navButton = this.displayLoginOrLogout();
    const usernameIcon = this.displayUsername();
    const component = this.displayLoginOrHomeComponent();

	  return(
	   <Router>
	  	<div>
        <ul className="nav-bar">
  		    <li className="left-nav-element"><Link className="link" to="/">Home</Link></li>
          {navButton}
          {usernameIcon}
        </ul>
      </div>
      {component}
	 	  <Switch>
        <Route path ="/logout">
          <Logout  userLoggedOut={this.userLoggedOut} handleErrors={this.handleErrors} />
        </Route>
		  </Switch>
	  </Router>
	 );
  }
}