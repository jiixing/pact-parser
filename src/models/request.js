'use strict';

var _ = require('underscore'),
    helpers = require('../helpers/request.helpers.js');

function Request(options) {
    this.method = options.method && options.method.toLowerCase();
    this.path = options.path;
    this.query = options.query || '';
    this.headers = options.headers || {};
    this.body = options.body || {};

    helpers.makeHeaderNamesLowerCaseRemoveSpaces(this.headers);
}

Request.prototype.match = function (request) {
    if (request.constructor !== Request) {
        request = new Request(request);
    }

    var isMethodTheSame = request.method && request.method.toLowerCase();
    isMethodTheSame = _.isEqual(this.method, isMethodTheSame);

    var expQuery = decodeURIComponent(helpers.parseQueryParams(this.query)),
        reqQuery = decodeURIComponent(helpers.parseQueryParams(request.query));

    var headerSame = helpers.areAllExpectationHeadersPesentInRequest(this.headers, request.headers);
    var querySame = _.isEqual(expQuery, reqQuery);
    var bodySame = _.isEqual(this.body, request.body);
    var pathSame = _.isEqual(this.path, request.path);
    var ret = pathSame && isMethodTheSame && querySame && bodySame && headerSame;

    if (!ret && pathSame && isMethodTheSame && querySame) {
        console.log("*** Error matching ", request.path);
        if (!headerSame) {
            console.log("header:\n", request.headers, "\n expecting:\n", this.headers);
        }
        if (!bodySame) {
            console.log("body:\n", request.body, "\n expecting:\n", this.body);
        }
    }
    return ret

};

module.exports = Request;