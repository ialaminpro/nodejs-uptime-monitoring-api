/**------------------------------------------------------------------------
 * @Title          :  Check Handler
 * @author         :  Al Amin
 * @email          :  ialamin.pro@gmail.com
 * @repo           :  https://github.com/ialaminpro/uptime-monitoring-application
 * @createdOn      :  07/04/2022
 * @description    :  Handler to handle user define check
 *------------------------------------------------------------------------* */

// dependencies
const data = require('../../lib/fileHandle');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const tokenHander = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
};

handler._check.get = (requestProperties, callback) => {
};

handler._check.put = (requestProperties, callback) => {
};

handler._check.delete = (requestProperties, callback) => {};

module.exports = handler;
