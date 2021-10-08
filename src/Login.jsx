import React from 'react';
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
  	const loginForm = document.getElementById('login-form');
  	const formData = new FormData(loginForm);
  	const csrftoken = this.props.getCookie('csrftoken');

  	fetch('http://127.0.0.1:8000/chat/login', {
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
  	})
  	.then(user => {
  		if (user){
 			this.props.loginAndSetUser(user.username);
 		}
  	})
  	document.getElementById("login-form").reset();
  }

  displayRegistrationForm = () => {
  	let form = null;
  	const displayForm = this.state.displayForm;
  	if (displayForm){
  		form =  <form id="registration-form" onSubmit={this.createNewUser}>
  		           <label for="user">Enter a username: </label>
  	               <input type="text" id="user" name="username"></input>
  	               <br></br>
  	               <label for="email">Enter an email: </label>
  	               <input type="email" id="email" name="email"></input>
  	               <br></br>
  	               <label for="password1">Enter a password: </label>
  	               <input type="password" id="password1" name="password1"></input>
  	               <br></br>
  	               <label for="password2">Re-enter password: </label>
  	               <input type="password" id="password2" name="password2"></input>
  	               <input type="submit"></input>
  	            </form>
  	}
  	return(form);
  }

  onClick = () => {
  	const displayForm = this.state.displayForm;
  	const newDisplay = displayForm ? false : true;
  	this.setState({
  		displayForm: newDisplay,
  	})
  }

  createNewUser = (event) => {
  	event.preventDefault();
  	const newUserForm = event.target;
  	const formData = new FormData(newUserForm);
  	const csrftoken = this.props.getCookie('csrftoken');

  	fetch('http://127.0.0.1:8000/chat/register', {
  		method: 'POST',
  		mode: 'cors',
  		headers: {
  			'X-CSRFToken': csrftoken, 
  		},
  		credentials: 'include',
  		body: formData,
  	})
  	.then(this.props.handleErrors)
  	.then(response => {
  		if (response.status === 200){
  			response.json();
  			alert("Registration success! Please login with your new credentials.")
  			this.setState({
  			displayForm: false,
  			})
  		}
  	})
  	.then(user => {
  		console.log(user);
  	})
  }

  render(){
  	const registrationForm = this.displayRegistrationForm();
  	return(
	  <div>
	  	<h1 id="login-title">Welcome to the Chat App!</h1>
	  	  <h4 style={{textAlign: 'center'}}>Please login.</h4>
	  	  <div style={{textAlign: 'center'}}>
	  	  	<form id="login-form" onSubmit={this.onSubmit}>
	  	  	  <p className="input-title">Username:  </p>
	  	  	  <input type="text" id="username-input" name="username"></input><br></br>
	  	  	  <p className="input-title">Password: </p>
	  	  	  <input type="password" id="password-input" name="password"></input><br></br>
	  	  	  <input type="submit" className="submit-button"></input>
	  	    </form>
	  	  </div>
	  	  <div>
	  	  	<h4 style={{textAlign: 'center'}}>Don't have an account? Click <button className="link"
	  	  	onClick={this.onClick}><b>HERE</b></button> to register.</h4>
	  	  	<div className="register-div">{registrationForm}</div>
	  	  </div>
	  </div>
  	);
  }
}