import { environments as environmentsInterface } from './lib/interfaces';

const environments: environmentsInterface = {}

environments.staging = {
    port: 3002,
    envName: 'staging',
    baseDir: 'root'
};

environments.production = {
    port: parseInt(process.env.port || '5000'),
    envName: 'production'
};


export {environments};

export const getConfig = () => {
    const node_env = process.env.NODE_ENV || '';
    const currentEnvironment = typeof (environments[node_env]) != 'undefined' ? environments[node_env] : ''
    return typeof (currentEnvironment) == 'object' ? currentEnvironment : environments.staging || {}
}