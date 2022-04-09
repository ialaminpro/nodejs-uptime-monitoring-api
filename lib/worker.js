/**------------------------------------------------------------------------
 * @Title          :  Workers library
 * @author         :  Al Amin
 * @email          :  ialamin.pro@gmail.com
 * @repo           :  https://github.com/ialaminpro/uptime-monitoring-application
 * @createdOn      :  10/04/2022
 * @description    :  Workers related files
 *------------------------------------------------------------------------* */

// dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./fileHandle');
const { parseJSON } = require('../helpers/utilities');
const { sendTwillioSms } = require('../helpers/notifications');

// worker object - module scaffolding
const worker = {};

// configuration
worker.config = {
    interval: 1000*60,
}

// send notification sms to user if state changes
worker.alertUserToStatusChange = (newCheckData) => {
    let msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;
    
    sendTwillioSms(newCheckData.userPhone, msg, (err) => {
        if(!err){
            console.log(`User was alerted to a status change via sms: ${msg}`);
        }else{
            console.log(`There was a problem sending sms to one of the user`);
        }
    });
};

// save check outcome to database and send to next process
worker.processCheckOutcome = (originalCheckData, checkOutCome) => {
    // check if check outcome is up or down
    let state = !checkOutCome.error && checkOutCome.responseCode && originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1 ? 'up' : 'down';

    // decide whether we should alert the user or not
    let alertWanted = !!(originalCheckData.lastChecked && originalCheckData.state !== state);
  
    // update the check data
    let newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    // update the check to disk
    data.update('checks', newCheckData.id, newCheckData, (err) => {
        
        if(!err){
        
            if(alertWanted){
            // send the checkdata to next process
            worker.alertUserToStatusChange(newCheckData);
            }else{
                console.log(`Alert is not needed as there is no state change!`);
            }
        }else{
            console.log(`Error: trying to save check data of one of the checks`);
        }
    })
};

// perform check
worker.performCheck = (originalCheckData) => {
    // prepare the initial check outcome
    let checkOutCome = {
        'error' : false,
        'responseCode': false
    };
    // mark the outcome has not been sent yet
    let outcomeSent  = false;

    // parse the hostname & full url from original data
    const parseUrl = url.parse(originalCheckData.protocol + '://' + originalCheckData.url, true);
    const hostName = parseUrl.hostname;
    const path = parseUrl.path;

    // construct the request
    const requestDetails = {
        'protocol' : originalCheckData.protocol + ':',
        'hostname' : hostName,
        'method' : originalCheckData.method.toUpperCase(),
        'path' : path,
        'timeout' : originalCheckData.timeoutSeconds * 1000,
    };

    const protocolToUse = originalCheckData.protocol === 'http' ? http: https;
    
    let req = protocolToUse.request(requestDetails, (res) => {
        // grab the status of the response
        const status  = res.statusCode;

        // update the check outcome and pass to the next process
        checkOutCome.responseCode = status;
        if(!outcomeSent){
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outcomeSent = true;
        }
        
    });

    req.on('error', (e) => {
        checkOutCome = {
            error: true,
            value: e,
        }
        // update the check outcome and pass to the next process
        if(!outcomeSent){
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outcomeSent = true;
        }
    });

    req.on('timeout', (e) => {
        checkOutCome = {
            error: true,
            value: 'timeout',
        }
        // update the check outcome and pass to the next process
        if(!outcomeSent){
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outcomeSent = true;
        }
    });

    req.end();
}
 
// validate individual check data
worker.validateCheckData = (originalData) => {
    let originalCheckData = originalData;
    if(originalCheckData && originalCheckData.id){
        originalCheckData.state =  typeof originalCheckData.state === 'string' && ['up','down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
        originalCheckData.lastChecked = typeof originalCheckData.lastChecked === 'number' && ['up','down'].indexOf(originalCheckData.lastChecked) > 0 ? originalCheckData.lastChecked : false;
        
        // pass to the next process
        worker.performCheck(originalCheckData);
    }else{
        console.log(`Error: check was invalid or properly formatted!`);
    }
};

// lookup all the checks
worker.gatherAllChecks = () => {
    data.list('checks', (err, checks) => {
        if(!err && checks && checks.length > 0){
            checks.forEach(check => {
                // read the check data
                data.read('checks', check, (error, originalCheckData) => {
                    if(!error && originalCheckData){
                        // pass the data to the check validator
                        worker.validateCheckData(parseJSON(originalCheckData));
                    }else{
                        console.log(`Error: reading one of the checks data!`);
                    }
                });
            });
        }else{
            console.log(`Error: could not find any checks to process`);
        }
    })
}

// timer to execute the worker process onec per minute
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, worker.config.interval);
}
// start the workers
worker.init = () => {
    // execute all the checks
    worker.gatherAllChecks();

    // call the loop so that checks continue
    worker.loop();
    
};

module.exports = worker;
