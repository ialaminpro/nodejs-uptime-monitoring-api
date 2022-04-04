/**
 * Title: Uptime Monitoring Application
 * Description: A RESTful  API to monitor up or down time of user defined links
 * Author: Al Amin
 * Date: 04/05/2022
 *
 */

// dependencies
const http = require('http');
const url = require('url');

// app object -  module scaffolding
const app = {};

// configuration
app.config = {
    port: 3000,
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listening to port ${app.config.port}`);
    });
};

// handle Request Response
app.handleReqRes = (req, res) => {
    // request handling
    // get the url and parse it
    const parseUrl = url.parse(req.url, true);
    console.log(parseUrl);
    // response handle
    res.end('Hello World');
};

// start the server
app.createServer();
