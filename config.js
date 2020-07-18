/*
    This is the file for environments, where you are going to have properties
    dependant of the environment(production, staging, for a particular user, etc)

    Here you can have connectionstring for database, secret key for jwt, 
    port for server, location for a file, etc...

    To add a new environment just add a property to environments variable,
    with the name of the environment.

    The environment to use is defined in the NODE_ENV variable, in your
    OS environment variables, this is a standard, if a hosting is not using
    this variable, you have to define it, or just change the environmentProvider
    for the name variable.

    For knowledge, is a standard that NODE_ENV is the environment variable to set
    the environment, and production is the name for production environment,
    for production mode, it is a advice to set the port property to 
    process.env.port, because some hosting service have just this enable port
    for your use.

    All the properties in the enviroment are opcional, in fact you can have
    an empty environment, but here are some properties that the server use if
    they are defined: 
    port (number) port of the server
    envName (string) name of the environment, will be display when the server start
    baseDir (string) root for files request, default: root
*/

const environmentProvider = 'NODE_ENV'
const environments = { }

environments.staging = {
    port: 3000,
    envName: 'staging',
    baseDir: 'root'
}

environments.production = {
    port: process.env.port || 5000,
    envName: 'production'
}




















// This is a part of the file you don't want to play
const currentEnvironment = typeof(environments[process.env[environmentProvider]]) != 'undefined' ? environments[process.env[environmentProvider]] : ''
const environmentToExport = typeof(currentEnvironment) == 'object' ? currentEnvironment : environments.staging || { }
module.exports = environmentToExport