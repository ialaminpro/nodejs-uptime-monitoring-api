/**------------------------------------------------------------------------
 * @Title          :  Utilities
 * @author         :  Al Amin
 * @email          :  ialamin.pro@gmail.com
 * @repo           :  https://github.com/ialaminpro/uptime-monitoring-application
 * @createdOn      :  05/04/2022
 * @description    :  Important utility funcations
 *------------------------------------------------------------------------* */

// dependencies
const crypto = require('crypto');

// module scaffolding
const utilities = {};
const environments = require('./environments');

// create random string
utilities.createRandomString = (strlength) => {
    let length = strlength;
    length = typeof(strlength) === 'number' && strlength > 0 ? strlength: false;

    if(length){
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for(let i = 1; i<= length; i+=1){
            let randomCharacter = possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length)
            );
            output += randomCharacter;
        }
        return output;
    }else{
        return false;
    }
};

// hash string
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};

// parse JSON string to Object
utilities.parseJSON = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }

    return output;
};
// export module
module.exports = utilities;
