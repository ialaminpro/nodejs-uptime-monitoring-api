/**------------------------------------------------------------------------
 * @Title          :  Data Storage in file system
 * @author         :  Al Amin
 * @email          :  ialamin.pro@gmail.com
 * @repo           :  https://github.com/ialaminpro/uptime-monitoring-application
 * @createdOn      :  05/04/2022
 * @description    :  Data Storage in file system
 *------------------------------------------------------------------------* */

// dependencies
const fs = require('fs');
const path = require('path');

const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = function (dir, file, data, callback) {
    // open file for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // write data to file and then close it
            fs.writeFile(fileDescriptor, stringData, (fsErr) => {
                if (!fsErr) {
                    fs.close(fileDescriptor, (error) => {
                        if (!error) {
                            callback(false);
                        } else {
                            callback('Error closing to new file!');
                        }
                    });
                } else {
                    callback('Error writing to new file!');
                }
            });
        } else {
            callback('Could not create new file. it may already exists!');
        }
    });
};

// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

// update existing file
lib.update = function (dir, file, data, callback) {
    // open file for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // truncate the file
            fs.ftruncate(fileDescriptor, (err1) => {
                if (!err1) {
                    // write data to file and then close it
                    fs.writeFile(fileDescriptor, stringData, (fsErr) => {
                        if (!fsErr) {
                            fs.close(fileDescriptor, (error) => {
                                if (!error) {
                                    // close the file
                                    fs.close(fileDescriptor, (err2) => {
                                        if (!err2) {
                                            callback(false);
                                        } else {
                                            callback('Error closing file!');
                                        }
                                    });
                                } else {
                                    callback('Error writing to file!');
                                }
                            });
                        } else {
                            callback('Error writing to new file!');
                        }
                    });
                } else {
                    callback('Error truncating file!');
                }
            });
        } else {
            callback('Error updating. File may not exist');
        }
    });
};

module.exports = lib;
