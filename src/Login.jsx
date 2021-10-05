import React from 'react';
import './App.css';


export const Login = (props) => {

  const getCookie = (name) => {
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

  const csrftoken = getCookie('csrftoken');

  const onSubmit = (event) => {
  	event.preventDefault();
  	let loginForm = document.getElementById('login-form');
  	let formData = new FormData(loginForm);
  	console.log(formData);

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
  		return response.json();
  	})
  	.then(data => {
  		console.log(data);
  	})
  	.catch(error => console.log(error))
  	document.getElementById("login-form").reset();
  }
  return(
	<div>
	  <h1 className="chat-title">Login</h1>
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