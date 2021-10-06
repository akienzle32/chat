import React from 'react';
import { Redirect } from 'react-router-dom';
import './App.css';

export class Logout extends React.Component {
  
  logoutUser(){
  	fetch('http://127.0.0.1:8000/chat/logout', {
  	  method: 'POST',
  	  mode: 'cors',
  	  headers: {
  	  	'X-CSRFToken': this.props.getCookie('csrftoken'),
  	  },
  	  credentials: 'include',
  	})
  	.then(this.props.handleErrors)
  	.then(response => {
  		if (response.status === 200){
  			this.props.userLoggedOut();
  		}
  	})
  	.catch(error => console.log(error))
  }
  
  componentDidMount(){
  	this.logoutUser();

  }
  render() {
  	return(
  	  <div>
        <Redirect to="/"></Redirect>
  	  </div>
  	);
  }
}