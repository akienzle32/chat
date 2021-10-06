import React from 'react';
import { Redirect } from 'react-router-dom';
import './App.css';

export class Logout extends React.Component {
  constructor(props){
  	super(props);
  }
/*
  getCookie = (name) => {
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
*/

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