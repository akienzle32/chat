import React from 'react';
import './App.css';


export const Login = (props) => {

  const onSubmit = (event) => {
  	event.preventDefault();
  	const loginForm = document.getElementById('login-form');
  	const formData = new FormData(loginForm);
  	const csrftoken = props.getCookie('csrftoken');

  	fetch('http://127.0.0.1:8000/chat/login', {
  		method: 'POST',
  		mode: 'cors',
      	headers: {
        'X-CSRFToken': csrftoken,
      	}, 
      	credentials: 'include',
      	body: formData,

  	})
  	.then(props.handleErrors)
  	.then(response => {
 		if (response.status === 200){
 			props.userLoggedIn();
 			return response.json();
 		}
  	})
  	.then(user => {
  		console.log(user);
  		props.setUser(user.username);
  	})
  	.catch(error => console.log(error))
  	document.getElementById("login-form").reset();
  }
  	return(
	  <div>
	  	<h1 id="login-title">Welcome to the Chat App!</h1>
	  	  <h4 style={{textAlign: 'center'}}>Please login.</h4>
	  	  <div style={{textAlign: 'center'}}>
	  	  	<form id="login-form" onSubmit={onSubmit}>
	  	  	  <p className="input-title">Username:  </p>
	  	  	  <input type="text" id="username-input" name="username"></input><br></br>
	  	  	  <p className="input-title">Password: </p>
	  	  	  <input type="password" id="password-input" name="password"></input><br></br>
	  	  	  <input type="submit" className="submit-button"></input>
	  	    </form>
	  	  </div>
	  </div>
  	);
}