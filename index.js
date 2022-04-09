/**------------------------------------------------------------------------
 * @Title          :  Project initial file
 * @author         :  Al Amin
 * @email          :  ialamin.pro@gmail.com
 * @repo           :  https://github.com/ialaminpro/uptime-monitoring-application
 * @createdOn      :  05/04/2022
 * @description    :  Initial file to start the node server and workers
 *------------------------------------------------------------------------* */

// dependencies
const server  = require('./lib/server');
const workers  = require('./lib/worker');

// app object - module scaffolding
const app = {};

app.init = () => {
    // start the server
    server.init();

    // start the workers
    workers.init();
}

app.init();

module.exports = app;