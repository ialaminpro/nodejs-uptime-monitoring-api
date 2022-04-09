/**------------------------------------------------------------------------
 * @Title          :  Notification Library
 * @author         :  Al Amin
 * @email          :  ialamin.pro@gmail.com
 * @repo           :  https://github.com/ialaminpro/uptime-monitoring-application
 * @createdOn      :  09/04/2022
 * @description    :  Important funcations to notify users
 *------------------------------------------------------------------------* */

// dependencies
const https = require('https');
const querystring = require('querystring');

// module scaffolding
const notifications = {};
const {twillio} = require('./environments');

// send sms to user using twillo api
notifications.sendTwillioSms = (phone, msg, callback) => {
    // input validation
    const userPhone = typeof(phone) === 'string' && phone.trim().length == 11 ? phone.trim() : false;
    const userMsg = typeof(msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
  
    if(userPhone && userMsg){
        // configure the request payload
        const payload = {
            From: twillio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMsg
        };

        // stringify the payload
        const stringifyPayload = querystring.stringify(payload);

        // configure the request details
        const requestDetails = {
            hostname: 'api.twillio.com',
            method: 'api.twillio.com',
            path: `/2010-04-01/Accounts/${twillio.accountSid}/Messages.json`,
            auth: `${twillio.accountSid}:${twillio.authToken}`,
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
            }
        }

        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status of the sent request
            const status = res.statusCode;
            // callback successfully if the request went through
            if(status === 200 || status === 201){
                callback(false);
            }else{
                callback(`Status code returned was ${status}`)
            }
        });

        req.on('error', (e) => {
            callback(e);
        });
        req.write(stringifyPayload);
        req.end();
    }else{
        callback('Given parameters were missing or invalid!');
    }
    
}

// export module
module.exports = notifications;
