'use strict'
const dialogflow = require('dialogflow');
const structjsnon = require('./structjson');
const config = require('../config/keys');

const projectID = config.googleProjectID;
const sessionID = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;
const credentials = {
	client_email: config.googleClientEmail,
	private_key: config.googlePrivateKey
};


 // Create a new session
const sessionClient = new dialogflow.SessionsClient({projectID:projectID, credentials:credentials});
const sessionPath = sessionClient.sessionPath(projectID, sessionID);

const Registration = mongoose.model('registration');


module.exports = {
	textQuery: async function(text, userID, parameters = {}) {
		const sessionPath = sessionClient.sessionPath(projectID, sessionID + userID);
		let self = module.exports;
		const request = {
		    session: sessionPath,
		    queryInput: {
		      text: {
		        // The query to send to the dialogflow agent
		        text:text,
		        // The language used by the client (en-US)
		        languageCode:languageCode,
		      },
		    },
		    queryParams: {
		    	payload: {
		    		data: parameters
		    	}
		    }
	  	};
	let responses = await sessionClient.detectIntent(request);
	responses = await self.handleAction(responses);
	return responses;
	},
	eventQuery: async function(event,userID, parameters = {}) {
		const sessionPath = sessionClient.sessionPath(projectID, sessionID + userID);
		let self = module.exports;
		const request = {
		    session: sessionPath,
		    queryInput: {
		      event: {
		        name:event,
		        parameters: structjsnon.jsonToStructProto(parameters),
		        languageCode: languageCode,
		      },
		    },
	  	};
	let responses = await sessionClient.detectIntent(request);
	responses = await self.handleAction(responses);
	return responses;
	},

	handleAction: function(responses){
		let self = module.exports;
		let queryResult = responses[0].queryResult;

		switch(queryResult.action){
			case'recommendcourse-yes':
				if(queryResult.allRequiredParamsPresent){
					self.saveRegistration(queryResult.parameters.fields);
				}

				break;
		}
		return responses;
	}

	saveRegistration: function(fields){
		const registration = new Registration({
			name: fields.name.stringValue,
			address: fields.name.stringValue,
			phone: fields.name.stringValue,
			email: fields.name.stringValue,
			registerDate: Date.now() 

		});

		try{
			registration.save();
		} catch(err){
			console.log(err);
		}
	}

}