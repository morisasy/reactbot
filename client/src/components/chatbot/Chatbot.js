import React,
	 {Component} from 'react';
import axios from 'axios/index';
import Message from './message';


class  Chatbot extends Component {
	messagesEnd;
	constructor(props){
		super(props);
		this.state = {
			messages: []
		}
	}

	async df_text_query(text){
		let says = {
			speaks: 'me',
			msg: {
				text: {
					text: text
				}
			}
		};

		this.setState({message: [...this.state.message, says]})
		const res = await axios.post('/api/df_text_query', {text});

		for (let msg of res.data.fulfillmentMessages){
			let says = {
				speaks: 'bot',
				msg: msg 
			}
			this.setState({message: [...this.state.message, says]});
		}
	}
	async df_event_query(event){
		const res = await axios.post('/api/df_event_query', {event});

		for (let msg of res.data.fulfillmentMessages){
			let says = {
				speaks: 'me',
				msg: msg 
			}
			this.setState({message: [...this.state.message, says]});
		}

	}

	componentDidÚpdate(){

		this.messagesEnd.scrollIntoView({behavior: "smooth"});
	}

	componentDidMount(){
		this.df_event_query('Welcome');
	}

	renderMessages(stateMessages){
		if (stateMessages){
			return stateMessages.map((message, i) => {
				return <Message key ={i} speaks = {message.speaks} text = {message.msg.text.text} />;
			});
		} else {
			return null;
		}

	}

	_handleInputKeyPress(e){
		if(e.key === 'Enter'){
			this.df_text_query(e.target.value);
			e.target.value = '';
		}
	}

	render(){
		return (
			<div style={{height: 400, width: 400, float: 'right'}}> 
				<div id = "chatbot" style= {{height: '100%', width: '100%', overflow: 'auto'}}>
					<h2>Chatbot says Hi!</h2>
					{this.renderMessages(this.state.message)}
					<div ref = {(el) => {this.messagesEnd = el;}}>
					</div>
					<input type = "text" autofocus="true" onKeyPress = {(e)=> this._handleInputKeyPress(e)}  />
				</div>
			</div>
		)
	}

}



export default Chatbot;