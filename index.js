'use strict';

var defaultAllowedText = 'User-agent: *\nDisallow:\n';
var defaultDisallowedText = 'User-agent: *\nDisallow: /\n';

/**
 * Create koa middleware that handles requests for '/robots.txt', according to the current domain
 * @param  {array} allowedDomains - Array of domains (strings), where search engines are allowed to trawl
 * @param  {string} [allowedText] - Content of the robots.txt for allowed domains
 * @param  {string} [disallowedText] - Content of the robots.txt for NON allowed domains
 * @return {function} koa middleware
 */
module.exports = function constructor(allowedDomains, allowedText, disallowedText) {

    if (!Array.isArray(allowedDomains)) {
        throw new Error('Please supply param [allowedDomains] in form of an Array');
    }

    // lowercase all domains for easy comparison
    for (var i = 0, l = allowedDomains.length; i < l; i++) {
        allowedDomains[i] = allowedDomains[i].toLowerCase();
    }

    // set allowedText to default, if not set
    if (typeof allowedText !== 'string') {
        allowedText = defaultAllowedText;
    }

    // set disallowedText to default, if not set
    if (typeof disallowedText !== 'string') {
        disallowedText = defaultDisallowedText;
    }

    return function* robotsTxtHandler(next) {
        
        if (this.path.toLowerCase() !== '/robots.txt') {
            return yield* next;
        }
        var host = this.hostname.toLowerCase();
        this.body = allowedDomains.indexOf(host) < 0 ? disallowedText : allowedText;
    }

};
