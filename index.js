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
const data = require('./lib/filehandle');

// testing file system
// TODO: Should to Remove it.

// create file
data.create('./', 'data', { name: 'Bangladesh', language: 'Bangla' }, (err) => {
    console.log(`error was`, err);
});

// read file
data.read('./', 'data', (err, result) => {
    console.log(err, result);
});

// update file
data.update('./', 'data', { name: 'USA', language: 'English' }, (err) => {
    console.log(`error was`, err);
});

// delete file
data.delete('./', 'data', (err) => {
    console.log(`error was`, err);
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
