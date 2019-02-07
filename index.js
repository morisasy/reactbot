const express = require('express');
const bodyParser = require('body-parser');


const app = express();

const config = require('./config/keys');
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {useNewUrlParser: true});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//require('./routes/dialogFlowRoutes')(app);
 const dialogFlow = require('./routes/dialogFlowRoutes');
 app.use('/dialog', dialogFlow);


const PORT = process.env.PORT || 5000;
app.listen(PORT);