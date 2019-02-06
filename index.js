const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//require('./routes/dialogFlowRoutes')(app);
 const dialogFlow = require('./routes/dialogFlowRoutes');
 app.use('/dialog', dialogFlow);


const PORT = process.env.PORT || 5000;
app.listen(PORT);