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
  	const username = formData.get('username');

  	fetch(`${process.env.REACT_APP_API}/api-token-auth/`, {
  		method: 'POST',
  		mode: 'cors',
  		credentials: 'include',
      	body: formData,
  	})
  	.then(response => {
  		if (response.status === 400){
  			alert('Your login credentials were not found.');
  		}
 		if (response.status === 200){
 			return response.json();
 		}
 		else {
 			this.props.handleErrors(response);
 		}
  	})
  	.then(data => {
  		// The data will be used to update the state of the main App component, and will also be added
  		// to local storage in order to keep the user logged in until they explicitly click log out.
  		if (data){
  			this.props.loginAndSetUser(username, data.token);
 			window.localStorage.setItem('username', username);
 			window.localStorage.setItem('token', data.token);
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
  		return <Register toggleDisplayForm={this.toggleDisplayForm} handleErrors={this.props.handleErrors} />
  	}
  }

  render(){
  	const registrationForm = this.displayRegistrationForm();
  	return(
		<div className="login-container">
			<div className="login-title-box">
				<h1 className="login-title">Welcome to the Chat App!</h1>
				<h4 className="login-subtitle">Please login.</h4>
			</div>
			<div style={{textAlign: 'center'}}>
				<form id="login-form" onSubmit={this.onSubmit}>
					<label htmlFor="username-input" className="login-label">Username: </label>
					<input className="login-input" type="text" id="username-input" name="username"></input><br></br>
					<label htmlFor="password-input" className="login-label">Password: </label>
					<input className="login-input" type="password" id="password-input" name="password"></input><br></br>
					<input type="submit" className="submit-button"></input>
				</form>
			</div>
			<div>
				<h4 style={{textAlign: 'center'}}>Don't have an account? Click <button className="login-page-btn reveal"
				onClick={this.toggleDisplayForm}><b>HERE</b></button> to register.</h4>
			</div>
			{registrationForm}
		</div>
	);
  }
}