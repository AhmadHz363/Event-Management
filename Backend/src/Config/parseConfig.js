const Parse = require('parse/node');

const APP_ID = process.env.PARSE_APP_ID || '';
const JS_KEY = process.env.PARSE_JS_KEY || '';
const Master_Key= process.env.PARSE_MASTER_KEY || '';
const SERVER_URL = process.env.PARSE_SERVER_URL || '';

Parse.initialize(APP_ID, JS_KEY,Master_Key);
Parse.serverURL = SERVER_URL;

module.exports = Parse;
