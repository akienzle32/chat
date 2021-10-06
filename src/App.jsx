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

  // Function provided by Django for adding csrf tokens to AJAX requests; see https://docs.djangoproject.com/en/3.2/ref/csrf/ for details.
  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
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

  displayNavBar(){
    let navBar = null;
    const loggedIn = this.state.loggedIn;
    const username = this.state.username;

    if (loggedIn){
      navBar = 
      <ul className="nav-bar">
        <li className="left-nav-element"><Link className="link" to="/">Home</Link></li>
        <li className="right-nav-element"><Link className="link" to="/logout">Log out</Link></li>
        <li className="right-nav-element" id="username">Signed in as <b>{username}</b></li>
      </ul>
    }
    return(navBar);
  }

  displayLoginOrHomeComponent(){
    let component;
    const { username, loggedIn } = this.state;
    if (!loggedIn){
      component = <Login getCookie={this.getCookie} username={username} userLoggedIn={this.userLoggedIn} setUser={this.setUser} />
    }
    else {
      component = <Home username={username} getCookie={this.getCookie} loggedIn={loggedIn}  />
    }

    return(component);
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
	 	  <Switch>
        <Route path="/logout">
          <Logout  getCookie={this.getCookie} userLoggedOut={this.userLoggedOut} handleErrors={this.handleErrors} />
        </Route>
		  </Switch>
	  </Router>
	 );
  }
}