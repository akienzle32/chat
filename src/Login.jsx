import React from 'react';
import { Redirect } from 'react-router-dom';
import './App.css';


export class Login extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		csrftoken: this.getCookie('csrftoken'),
  	}
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

  onSubmit = (event) => {
  	event.preventDefault();
  	let loginForm = document.getElementById('login-form');
  	let formData = new FormData(loginForm);
  	console.log(formData);

  	fetch('http://127.0.0.1:8000/chat/login', {
  		method: 'POST',
  		mode: 'cors',
      	headers: {
        'X-CSRFToken': this.state.csrftoken,
      	}, 
      	credentials: 'include',
      	body: formData,

  	})
  	.then(this.props.handleErrors)
  	.then(response => {
 		if (response.status === 200){
 			this.setState({
 				redirect: true,
 			})
 			this.props.userLoggedIn();
 			return response.json();
 		}
  	})
  	.then(user => {
  		console.log(user);
  		this.props.setUser(user.username);
  	})
  	.catch(error => console.log(error))
  	document.getElementById("login-form").reset();
  }
  render() {

  	return(
	  <div>
	  	<h1 className="chat-title">Login</h1>
	  	  <div style={{textAlign: 'center'}}>
	  	  	<form id="login-form" onSubmit={this.onSubmit}>
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
}