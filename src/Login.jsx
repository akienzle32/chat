import React from 'react';
import { Register } from './Register';
import './App.css';


export class Login extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		displayForm: false,
  	}
  }

  onSubmit = (event) => {
  	event.preventDefault();
  	const loginForm = event.target;
  	const formData = new FormData(loginForm);
  	const csrftoken = this.props.getCookie('csrftoken'); // Django has trouble setting csrf tokens on dynamically added forms
  	                                                     // (see https://docs.djangoproject.com/en/3.2/ref/csrf/), so I've worked 
  	                                                     // around this problem by passing down the function to retrieve the cookie
  	                                                     // rather than the cookie itself. 

  	fetch('https://alec-chat-api.herokuapp.com/login', {
  		method: 'POST',
  		mode: 'cors',
      	headers: {
        'X-CSRFToken': csrftoken,
      	}, 
      	credentials: 'include',
      	body: formData,

  	})
  	.then(response => {
  		if (response.status === 404){
  			alert('Your login credentials were not found.');
  		}
 		if (response.status === 200){
 			return response.json();
 		}
 		else {
 			this.props.handleErrors(response);
 		}
  	})
  	.then(user => {
  		if (user){
 			this.props.loginAndSetUser(user.username);
 		}
  	})
  	.catch(error => console.log(error));
  	document.getElementById("login-form").reset();
  }

  toggleDisplayForm = () => {
  	const displayForm = this.state.displayForm;
  	this.setState({
  		displayForm: displayForm ? false : true,
  	})
  }

  displayRegistrationForm = () => {
  	const displayForm = this.state.displayForm;
  	if (displayForm){
  		return <Register toggleDisplayForm={this.toggleDisplayForm} getCookie={this.props.getCookie} />
  	}
  }

  render(){
  	const registrationForm = this.displayRegistrationForm();
  	return(
	  <div>
	  	<h1 id="login-title">Welcome to the Chat App!</h1>
	  	  <h4 className="title">Please login.</h4>
	  	  <div style={{textAlign: 'center'}}>
	  	  	<form id="login-form" onSubmit={this.onSubmit}>
	  	  	  <label htmlFor="username-input" className="login-label">Username: </label>
	  	  	  <input type="text" id="username-input" name="username"></input><br></br>
	  	  	  <label htmlFor="password-input" className="login-label">Password: </label>
	  	  	  <input type="password" id="password-input" name="password"></input><br></br>
	  	  	  <input type="submit" className="submit-button"></input>
	  	    </form>
	  	  </div>
	  	  <div>
	  	  	<h4 style={{textAlign: 'center'}}>Don't have an account? Click <button className="link"
	  	  	onClick={this.toggleDisplayForm}><b>HERE</b></button> to register.</h4>
	  	  	<div className="register-div">{registrationForm}</div>
	  	  </div>
	  </div>
  	);
  }
}