// requests.js

const config = require('config.js');
const url = config.config.host;
const base64 = require('base64.min.js').Base64;

//wx.request({
//  url: url + '/v1/teacher/',
//})