import React from 'react';

const QuickReply = (props) => {
	if( props.reply.structValue.fiels.payload){
		return (
			<a style = {{margin: 3}} className = "btn-floating btn-large waves-effect waves-light red"
			 onClick = {() => props.click(
			 	props.reply.structValue.fields.payload.structValue,
			 	props.reply.structValue.fields.text.structValue
			 	)} 
			 >
				{props.reply.structValue.fields.text.structValue}
			</a>
		);
	} else {
		return (
			<a style = {{margin: 3}} className ="btn-floating btn-large waves-effect waves-light red" 
			href = {props.reply.structValue.fields.link.structValue} >
				{props.reply.structValue.fields.text.structValue}
			</a>
		);
	}
}

export default QuickReply;