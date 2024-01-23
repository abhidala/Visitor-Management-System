//import {pathToRegexp} from 'path-to-regexp'
import pathToRegexp = require("path-to-regexp")
export const Constants ={

    BY_PASS_URLS : [
        '/auth/login' ,
        '/health',
    pathToRegexp('/user/update/:userId')] ,
    JWT_KEY : 'THIS-IS-MY-SECRET-KEY'
}