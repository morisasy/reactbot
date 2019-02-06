import React,
	 {Component} from 'react';
import axios from 'axios/index';
import { withRouter } from 'react-router-dom';
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
			messages: [],
			showBot: true,
			showWelcomeSent: false
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
		if(this.talkInput){
			this.talkInput.focus();
		}
	}

	resoloveAfterXSeconds(x){
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(x);
			}, x * 1000);
		});
	}

	async componentDidMount(){
		this.df_event_query('Welcome');

		if(window.location.pathname === '/shop' && !this.state.shopWelcomeSent){
			await this.resoloveAfterXSeconds(1);
			this.df_event_query('WELCOME_SHOP');
			this.setState({shopWelcomeSent: true, showBot: true});
		}

		this.props.history.listen(() => {
			console.log('listening');
			if(this.props.history.location.pathname === 'shop' && !this.state.shopWelcomeSent){
				this.df_event_query('WELCOME_SHOP');
				this.setState({shopWelcomeSent: true, showBot: true});
			}
		})
	}

	show = () =>{
		this.setState({showBot: true})
	}

	hide = () =>{
		this.setState({showBot: false})
	}

	_handleQuickRepliePayload(payload, text){
		switch(payload){
			case 'recommended_yes':
				this.df_event_query('SHOW_RECOMMENDATIONS');
				break;

			case 'training_masterclass':
				this.df_event_query('MASTERCLASS');
				break;

			default:
				this.df_text_query(text);
			break;
		}
		
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
		} else if(message.msg && 
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
							</div>;
				
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
		if (this.state.showBot){
			return (
				<div style={{height: 500,
					 width: 400, 
					 position: 'absolute', 
					 bottom: 0, 
					 right: 0,
					 border: "1px solid grey", 
					 float: 'right'}}> 

					<nav>
						<div className = "nav-wrapper">
							<a className = "brand-log">Chatbot</a>
							<ul id="nav-mobile" className="right hide-on-med-and-down">
								<li><a onClick = {this.hide} > Close</a></li>
							</ul>
						</div>
					</nav>
					<div id = "chatbot" style= {{height: 388,
						 width: '100%', 
						 overflow: 'auto'}}>
						
						{this.renderMessages(this.state.message)}
						<div ref = {(el) => {this.messagesEnd = el;}} 
							style = {{float: 'left', clear: "both"}}>
						</div>

					</div>
					<div className = "col s12">
					<input 
						style = {{margin: 0, 
							paddingLeft: '1%',
							paddingRight: '1%',
							width: '98%'}}
						placeholder = "Type a message"
						type = "text" 
						autofocus="true" 
						ref = {(input) => {this.talkInput = input}} 
						onKeyPress = {(e)=> this._handleInputKeyPress(e)}  />
					</div>
				</div>
			)

		} else {
			return (
			<div style={{height: 40,
				 width: 400, 
				 position: 'absolute', 
				 bottom: 0, 
				 right: 0,
				 border: "1px solid grey", 
				 float: 'right'}}> 
				<nav>
					<div className = "nav-wrapper">
						<a className = "brand-log">Chatbot</a>
						<ul id="nav-mobile" className="right hide-on-med-and-down">
								<li><a onClick = {this.show} > show</a></li>
							</ul>
					</div>
				</nav>
				<div ref = {(el) => {this.messagesEnd = el;}} 
							style = {{float: 'left', clear: "both"}}>
				</div>
				
			</div>
		)

		}
		
	}

}



export default withRouter(Chatbot);