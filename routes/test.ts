import { routeMethod } from "../lib/interfaces"

export const get: routeMethod = (req, res) => {
    res.writeHead(200);
    res.end('Test');
}