/**------------------------------------------------------------------------
 * @Title          :  Token Handler
 * @author         :  Al Amin
 * @email          :  ialamin.pro@gmail.com
 * @repo           :  https://github.com/ialaminpro/uptime-monitoring-application
 * @createdOn      :  09/04/2022
 * @description    :  Handler to handle token related routes
 *------------------------------------------------------------------------* */

// dependencies
const { hash } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
    
};

handler._token.get = (requestProperties, callback) => {
   
};

handler._token.put = (requestProperties, callback) => {
    
};

handler._token.delete = (requestProperties, callback) => {

};

module.exports = handler;
