const baseDir = 'api/'

const routes = [
    { path: 'test', use: require('./test') }
]


















var routesToReturn = { }
for(var i = 0; i < routes.length; i++) {
    const route = routes[i]
    routesToReturn[baseDir + route.path] = route.use
}
module.exports = routesToReturn

