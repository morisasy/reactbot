import React from 'react';

const Card = (props) => (
	<div style = {{display: flex; ,justifyContent: flexEnd;, paddingRight: 30, width: 270}}>
		<div class="card">
	        <div class="card-image" style = {{width: 240}}>
	          <img alt = {props.payload.fields.header.stringValue}
	           src= {props.payload.fields.image.stringValue} />
	          <span class="card-title">{props.payload.fields.header.stringValue}</span>
	        </div>
	        <div class="card-content">
	         	{props.payload.fields.description.stringValue}
	         	<p><a>{props.payload.fields.price.stringValue}</a></p>
	        </div>
	        <div class="card-action">
	          <a target="_blank" href={props.payload.fields.link.stringValue}>GET NOW</a>
	        </div>
      </div>
	<div>
)

export default Card;