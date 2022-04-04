/**------------------------------------------------------------------------
 * @Title          :  Not found Handler
 * @author         :  Al Amin
 * @email          :  ialamin.pro@gmail.com
 * @repo           :  https://github.com/ialaminpro/uptime-monitoring-application
 * @createdOn      :  05/04/2022
 * @description    :  Not found Handler
 *------------------------------------------------------------------------* */

// module scaffolding
const handler = {};

handler.notFoundHander = (requestProperties, callback) => {
    callback(404, {
        message: 'Your requested URL was not found!',
    });
};

module.exports = handler;
