const express = require('express');
const subdomain = require('express-subdomain');
const bodyParser = require('body-parser');
const routes = require('./routes');
const rabbitmq = require('./utils/rabbitmq');

const app = express();
const port = process.env.PORT || 8000;
const mode = process.env.MODE || 'local';

// Utilize body-parser middleware to easily handle JSON
app.use(bodyParser.json({limit: '2mb'}));


// Handle routes
app.use('/', routes);
app.use(express.static(__dirname + '/client'));
app.use(subdomain('img', express.static('/images', {extensions: ['jpeg', 'jpg', 'png']})));

// Handles non-existent routes
app.use('*', function (req, res) {
    res.status(404).json({
        error: "Requested resource " + req.originalUrl + " does not exist"
    });
});

// Static serving

// Start server
app.listen(port, function() {
    console.log("== Server is running on port", port);
});

// Starts rabbitmq stuff
if (mode !== 'local') {
    rabbitmq.initTaskChannel();
    rabbitmq.startReturnChannel();
}

// if (mode === 'testing') {
//   app.set('url', 'localhost:' + port);
// }
// else if (mode === 'production') {
//   app.set('url', 'example.com');
// }
