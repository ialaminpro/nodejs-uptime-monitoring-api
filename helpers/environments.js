/**------------------------------------------------------------------------
 * @Title          :  Environments
 * @author         :  Al Amin
 * @email          :  ialamin.pro@gmail.com
 * @repo           :  https://github.com/ialaminpro/uptime-monitoring-application
 * @createdOn      :  05/04/2022
 * @description    :  Handle all environment related things
 *------------------------------------------------------------------------* */

// dependencies

// module scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'dfadferqrfdasfasdfasd',
    maxChecks: 5,
    twillio: {
        fromPhone: '+15005550006',
        accountSid: 'AC344c64f920854bdb14167a45a1c4bb1b',
        authToken: 'a8264dcd9f3791c4f4fc62a31763e77f',
    }
};

environments.production = {
    port: 3000,
    envName: 'production',
    secretKey: 'dfasdfasdfweedfsdfasdfs',
    maxChecks: 5,
    twillio: {
        fromPhone: '+15005550006',
        accountSid: 'AC344c64f920854bdb14167a45a1c4bb1b',
        authToken: 'a8264dcd9f3791c4f4fc62a31763e77f',
    }
};

// determine which environment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// export module
module.exports = environmentToExport;
