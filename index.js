/**------------------------------------------------------------------------
 * @Title          :  Uptime Monitoring Application
 * @author         :  Al Amin
 * @email          :  ialamin.pro@gmail.com
 * @repo           :  https://github.com/ialaminpro/uptime-monitoring-application
 * @createdOn      :  05/04/2022
 * @description    :  A RESTful  API to monitor up or down time of user defined links
 *------------------------------------------------------------------------* */

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

// testing file system
// TODO: Should to Remove it.

data.create('test', 'NewFile', { name: 'Bangladesh', language: 'Bangla' }, (err) => {
    console.log(`error was`, err);
});

data.read('test', 'NewFile', (err, result) => {
    console.log(err, result);
});

// app object - module scaffolding
const app = {};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);
    });
};

// handle Request Response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
