import React from 'react';
import { StartChat } from './StartChat';

export class Home extends React.Component {


  render() { 
  
	return (
	  <div>
		<div>
			<StartChat chats={this.props.chats} participants={this.props.participants} 
  	onSubmit={this.props.onSubmit} onClick={this.props.onClick} />;
		</div>
	  </div>
	);
  }
}