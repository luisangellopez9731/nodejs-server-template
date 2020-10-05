import { IncomingHttpHeaders, ServerResponse } from 'http'
import { ParsedUrlQuery } from 'querystring'

export interface environment {
  port: Number,
  envName?: String,
  baseDir?: String
}

export interface environments {
  [key: string]: environment
}

export interface request {
  path: string,
  query: ParsedUrlQuery,
  headers: IncomingHttpHeaders,
  method: string,
  payload: {[key: string]: string} | string,
}

export type routeMethod = (req: request, res: ServerResponse) => void

export interface routeUse {
  post?: routeMethod
  get?: routeMethod
  delete?: routeMethod
  update?: routeMethod
}

export interface route {
  path: String
  use: routeUse
  [key: string]: string|any;
}

export interface routeDef {
  baseDir?:String
  routes: route[]
}

export interface routeOptions {
  status?: string
  headers?: {[key:string]: string}
}