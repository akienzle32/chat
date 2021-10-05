import React from 'react';
import './App.css';


export const Login = (props) => {

  const onSubmit = (event) => {
  	event.preventDefault();

  	fetch('http://127.0.0.1:8000/accounts/login', {
  		method: 'POST',
  		mode: 'cors',

  	})
  	.then(props.handleErrors)
  	.then(response => {
  		return response.json();
  	})
  	.then(data => {
  		console.log(data);
  	})
  	.catch(error => console.log(error))
  }
  return(
	<div>
	  <h1 className="chat-title">Login</h1>
	  	<div style={{textAlign: 'center'}}>
	  	  <form onSubmit={onSubmit}>
	  	  	<p className="input-title">Username:  </p>
	  	  	<input type="text" name="username"></input><br></br>
	  	  	<p className="input-title">Password: </p>
	  	  	<input type="password" name="password"></input><br></br>
	  	  	<input type="submit" className="submit-button"></input>
	  	  </form>
	  	</div>
	</div>
  );
}