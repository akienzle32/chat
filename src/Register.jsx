import React from 'react';
import './App.css';

export const Register = (props) => {

  const onSubmit = (event) => {
  	event.preventDefault();
  	const newUserForm = event.target;
  	const formData = new FormData(newUserForm);

  	fetch(`${process.env.REACT_APP_API}/register`, {
  		method: 'POST',
  		mode: 'cors',
  		credentials: 'include',
  		body: formData,
  	})
  	.then(response => {
  		if (response.status === 400)
  			return response.text();
  		if (response.status === 200)
  			return response.json();
  		else
  			this.props.handleErrors(response);
  	})
  	.then(object => {
  		if (object){
  			console.log(object);
  			if (object === 'Passwords do not match' || object === 'That username is not available')
  				alert(object);
  			else{
  				alert("Registration success! Please login with your new credentials.");
  				props.toggleDisplayForm();
  			}
  		}
  	})
  	.catch(error => console.log(error))
  }
	return(
	  <div className="register-div">
	  	<form id="registration-form" onSubmit={onSubmit}>
	  		<label htmlFor="user" className="register-label">Enter a username: </label>
	  		<input className="login-input register" type="text" id="user" name="username"></input>
	  		<br></br>
	  		<label htmlFor="email" className="register-label">Enter an email: </label>
	  		<input className="login-input register" type="email" id="email" name="email"></input>
	  		<br></br>
	  		<label htmlFor="password1" className="register-label">Enter a password: </label>
	  		<input className="login-input register" type="password" id="password1" name="password1"></input>
	  		<br></br>
	  		<label htmlFor="password2" className="register-label">Re-enter password: </label>
	  		<input className="login-input register" type="password" id="password2" name="password2"></input>
	  		<br></br>
	  		<input className="login-page-btn submit" type="submit"></input>
	  	</form>
	  </div>
	);
}