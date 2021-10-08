import React from 'react';
import './App.css';

export const Register = (props) => {

  const createNewUser = (event) => {
  	event.preventDefault();
  	const newUserForm = event.target;
  	const formData = new FormData(newUserForm);
  	const csrftoken = props.getCookie('csrftoken');

  	fetch('http://127.0.0.1:8000/chat/register', {
  		method: 'POST',
  		mode: 'cors',
  		headers: {
  			'X-CSRFToken': csrftoken, 
  		},
  		credentials: 'include',
  		body: formData,
  	})
  	.then(response => {
  		if (response.status === 400)
  			return response.text();
  		if (response.status === 200)
  			return response.json();
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
  }
	return(
		<div>
		  <form id="registration-form" onSubmit={createNewUser}>
			<label htmlFor="user">Enter a username: </label>
			<input type="text" id="user" name="username"></input>
			<br></br>
			<label htmlFor="email">Enter an email: </label>
			<input type="email" id="email" name="email"></input>
  	        <br></br>       
  	        <label htmlFor="password1">Enter a password: </label>      
  	        <input type="password" id="password1" name="password1"></input>       
  	        <br></br>       
  	        <label htmlFor="password2">Re-enter password: </label>      
  	        <input type="password" id="password2" name="password2"></input>      
  	        <br></br>      
  	        <input id="submit-registration" type="submit"></input>  
  	      </form>
			
		</div>
	);
}