import React,
	 {Component} from 'react';
import axios from 'axios/index';
import Message from './message';
import Cookies from 'universal-cookie';
import {v4 as uuid } from 'uuid';
import Card from './Card';

const cookies = new Cookies();


class  Chatbot extends Component {
	messagesEnd;
	talkInput;
	constructor(props){
		super(props);
		this._handleQuickRepliePayload = this._handleQuickRepliePayload.bind(this);
		this.state = {
			messages: []
		}
		if (cookies.get('userID') === undefined){
			cookies.set('userID', uuid(), {path: '/'});

		}
		
	}

	async df_text_query(queryText){
		let says = {
			speaks: 'me',
			msg: {
				text: {
					text: queryText
				}
			}
		};

		this.setState({message: [...this.state.message, says]})
		const res = await axios.post('/api/df_text_query', {text: queryText, userID: cookies.get('userID')});

		for (let msg of res.data.fulfillmentMessages){
			let says = {
				speaks: 'bot',
				msg: msg 
			}
			this.setState({message: [...this.state.message, says]});
		}
	}
	async df_event_query(eventName){
		const res = await axios.post('/api/df_event_query', {event: eventName, userID: cookies.get('userID')});

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

	_handleQuickRepliePayload(payload, text){
		this.df_text_query(text);
	}

	rendercards(cards){
		return cards.map((card, i) => <Card key = {i} payload = {card.structValue} />);

	}

	renderOneMessage(message, i){
		if(message.msg && message.msg.text && message.msg.text.text ){
					return <Message 
						key ={i} 
						speaks = {message.speaks} 
						text = {message.msg.text.text} />;
		}else if(message.msg && 
				message.msg.payload && 
				message.msg.payload.fields && 
				message.msg.payload.fields.card)
		{
					return <div key = {i} >
									<div className="card-panel grey lighten-5 z-depth-1">
										<div style= {{overflow: 'hidden'}}>
											<div className = "col s2">
											  <a class="btn-floating btn-large waves-effect waves-light red">
											  	{message.speaks}</a>
											</div>
											<div style = {{height: 300,
												 width: message.msg.payload.fields.cards.listValue.length * 270}} >
												{this.renderCards(message.msg.payload.fields.careds.listValue.values)}
											</div>
										</div>
									</div>
							</div>
				
		} else {
					return <h2>Cards</h2>;
		}

	}
	renderMessages(stateMessages){
		if (stateMessages){
			return stateMessages.map((message, i) => {
				return this.renderOneMessage(message, i);		
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
			<div style={{height: 500, width: 400, position: 'absolute', bottom: 0, right: 0,border: "1px solid grey", float: 'right'}}> 
				<nav>
					<div className = "nav-wrapper">
						<a className = "brand-log">Chatbot</a>
					</div>
				</nav>
				<div id = "chatbot" style= {{height: 388, width: '100%', overflow: 'auto'}}>
					
					{this.renderMessages(this.state.message)}
					<div ref = {(el) => {this.messagesEnd = el;}} 
						style = {{float: 'left', clear: "both"}}>
					</div>

				</div>
				<div className = "col s12">
				<input 
					style = {{margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%'}}
					placeholder = "Type a message"
					type = "text" 
					autofocus="true" 
					ref = {(input) => {this.talkInput = input}} 
					onKeyPress = {(e)=> this._handleInputKeyPress(e)}  />
				</div>
			</div>
		)
	}

}



export default Chatbot;