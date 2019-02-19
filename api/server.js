const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const rabbitmq = require('./utils/rabbitmq');

const app = express();
const port = process.env.PORT || 8000;


// Utilize body-parser middleware to easily handle JSON
app.use(bodyParser.json());

// Handle routes
app.use('/', routes);
app.use(express.static(__dirname + '/client'));


app.use('*', function (req, res) {
    res.status(404).json({
        error: "Requested resource " + req.originalUrl + " does not exist"
    });
});

// Start server
app.listen(port, function() {
    console.log("== Server is running on port", port);
});

// Starts rabbitmq stuff
rabbitmq.initTaskChannel();
rabbitmq.startReturnChannel();