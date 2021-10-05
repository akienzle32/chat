import React from 'react';
import './App.css';


export const Login = () => {
  return(
	<div>
	  <h1 className="chat-title">Login</h1>
	  	<div style={{textAlign: 'center'}}>
	  	  <form>
	  	  	<p className="input-title">Username:  </p>
	  	  	<input type="text" name="username"></input><br></br>
	  	  	<p className="input-title">Password: </p>
	  	  	<input type="password" name="password"></input>
	  	  </form>
	  	</div>
	</div>
  );
}