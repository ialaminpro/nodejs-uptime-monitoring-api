/**------------------------------------------------------------------------
 * @Title          :  User Handler
 * @author         :  Al Amin
 * @email          :  ialamin.pro@gmail.com
 * @repo           :  https://github.com/ialaminpro/uptime-monitoring-application
 * @createdOn      :  07/04/2022
 * @description    :  Handler to handle user related routes
 *------------------------------------------------------------------------* */

// dependencies
const data = require('../../lib/fileHandle');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const tokenHander = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean'
            ? requestProperties.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user doesn't already exists
        data.read('users', phone, (err) => {
            if (err) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // store the user to db
                data.create('users', phone, userObject, (error) => {
                    if (!error) {
                        callback(200, {
                            error: 'User was created successfully!',
                        });
                    } else {
                        callback(500, {
                            error: 'Could not create user!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in server side',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

handler._users.get = (requestProperties, callback) => {
    // check the phone number if valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    if (phone) {

        // verify token
        let token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;
        tokenHander._token.verify(token, phone, (tokenId) => {
            if(tokenId){
                // lookup the user
                data.read('users', phone, (err, u) => {
                
                    const user = { ...parseJSON(u) };

                    if (!err && user) {
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, {
                            error: 'Requested user not found!',
                        });
                    }
                });
            }else{
                callback(403, {
                    error: 'Authentication failure!',
                })
            }
        })
        
    } else {
        callback(404, {
            error: 'Requested user not found!',
        });
    }
};

handler._users.put = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    if (phone) {
        if (firstName || lastName || password) {

            // verify token
            let token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;
            tokenHander._token.verify(token, phone, (tokenId) => {
                if(tokenId){
                    // lookup the user
                    data.read('users', phone, (err, uData) => {
                        const userData = { ...parseJSON(uData) };

                        if (!err && userData) {
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.password = hash(password);
                            }

                            // update to database
                            data.update('users', phone, userData, (error) => {
                                if (!error) {
                                    callback(200, {
                                        message: 'User was updated successfully!',
                                    });
                                } else {
                                    callback(500, {
                                        error: 'There was a problem in the server side!',
                                    });
                                }
                            });
                        } else {
                            callback(400, {
                                error: 'You have a problem in your request',
                            });
                        }
                    });
                }else{
                    callback(403, {
                        error: 'Authentication failure!',
                    })
                }
            })

        } else {
            callback(400, {
                error: 'You have a problem in your request',
            });
        }
    } else {
        callback(400, {
            error: 'Invalid phone number, Please try again!',
        });
    }
};

handler._users.delete = (requestProperties, callback) => {
    // check the phone number if valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    if (phone) {
        // verify token
        let token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;
        tokenHander._token.verify(token, phone, (tokenId) => {
            if(tokenId){
                // lookup the user
                data.read('users', phone, (err, userData) => {
                    if (!err && userData) {
                        data.delete('users', phone, (error) => {
                            if (!error) {
                                callback(200, {
                                    message: 'User was successfully deleted!',
                                });
                            } else {
                                callback(500, {
                                    error: 'There was a server side error!',
                                });
                            }
                        });
                    } else {
                        callback(500, {
                            error: 'There was a server side error!',
                        });
                    }
                });
            }else{
                callback(403, {
                    error: 'Authentication failure!',
                })
            }
        })
    } else {
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }
};

module.exports = handler;
