"use strict";

/**
 * XHR Implementation
 * it has a cache layer for the "svg" part or others if someone wants to implement it.
 *
 * options
 * {
 *  method : post|get|put|delete,
 *  synchronous: true|false,
 *  data: {*},
 *  url: {string},
 *  dataType: JSON|svg|other
 *  username: {string}
 *  password: {string}
 *  raw : true|false
 *  withCredentials: true|false,
 *  headers: {*},
 *  cacheActive: true|false
 * }
 *
 * @author Jakob Oberhummer
 * @param {*} param
 *
 * @constructor
 */
function AjaxConnection(param) {
    /**
     * xhr connection
     *
     * @type {XMLHttpRequest}
     */
    this.xhr = new XMLHttpRequest();

    /**
     * standard method
     * 1. post
     * 2. get
     * 3. put
     * 4. delete
     *
     * @type {string}
     */
    this.method = "post";

    /**
     * if it's a synchronous or an asynchronous request
     * @type {boolean}
     */
    this.asynchronous = true;

    /**
     * readyState of the current request
     * @type {number}
     */
    this.readyState = 0;

    /**
     * status of the current request
     * @type {number}
     */
    this.status = 0;


    /**
     * the response of the XHR object
     *
     * @type {string}
     */
    this.response = '';

    /**
     * data that's being sent
     * @type {string}
     */
    this.data = '';

    /**
     * current url to be requested
     *
     * @type {string}
     */
    this.url = '';

    /**
     * dataType of the return data
     * @type {string}
     */
    this.dataType = 'JSON';

    /**
     * username
     * @type {string}
     */
    this.username = null;

    /**
     * password
     *
     * @type {string}
     */
    this.password = null;

    /**
     * headers
     *
     * @type {{}}
     */
    this.headers = {};

    /**
     * if it's a raw submit (json || xml || something made up)
     * @type {boolean}
     */
    this.raw = false;

    /**
     * if there is a password &  username
     * @type {boolean}
     */
    this.withCredentials = false;

    /**
     * sets the timeout
     * @type {number}
     */
    this.timeout = 0;

    /**
     * this is if we need to add multiple svg or whatever content
     * calls so we cache them
     * @type {boolean}
     */
    this.cacheActive = false;

    /**
     * @type {{key: string, cache: *, set: Function, get: Function}}
     */
    this.cache = this.initCache();


    /**
     * hook for onloadstart
     *
     * @param e
     */
    this.onloadstart = function (e){};

    /**
     * hook for onload end -> triggers the success callback
     *
     * @type {function(this:AjaxConnection)}
     */
    this.onloadend = function(e)
    {
        this.status = e.currentTarget.status;
        this.readyState = e.currentTarget.readyState;
        this.statusText = e.currentTarget.statusText;

        this.checkResponseHeader(e.currentTarget);

        if (this.status == 200 && this.readyState == 4){
            switch (this.dataType.toLowerCase()) {
                default:
                    this.response = e.currentTarget.response;
                    break;
                case 'json':
                    this.response = (e.currentTarget.response) ? JSON.parse(e.currentTarget.response) : null;
                    break;
                case 'svg':
                    if (this.cacheActive && !this.cache.get(this.url)) {
                        this.cache.set(this.url, e.currentTarget.response);
                    }
                    this.response = e.currentTarget.response;
                    break;
            }
        }

        this.success(this.response);
    }.bind(this);

    /**
     *
     * @type {function(this:AjaxConnection)}
     */
    this.success = function(data) {}.bind(this);

    /**
     * hook for on progress
     *
     * @param e
     */
    this.onprogress = function(e){};

    /**
     * hook for on error
     *
     *
     * @param e
     */
    this.onerror = function(e){};

    /**
     * hook for on timeout
     *
     * @param e
     */
    this.ontimeout = function(e) {};

    /**
     * hook for on abort
     *
     * @param e
     */
    this.onabort = function(e) {};

    /**
     * hook for onload
     *
     * @param e
     */
    this.onload = function(e) {};

    /**
     * init of all parameters given
     */
    this.ajax(param);
}
/**
 * checks if the response header contains json
 * so we set it correct
 *
 * @param currentTarget
 */
AjaxConnection.prototype.checkResponseHeader = function(currentTarget){
    var header;
    if (header = currentTarget.getResponseHeader('Content-Type')) {
        if (header.indexOf('json') != -1) {
            this.dataType = 'json';
        } else if (header.indexOf('html') != -1){
            this.dataType = 'html';
        } else if (header.indexOf('svg') != -1) {
            this.dataType = 'svg';
        } else {
            this.dataType = 'text'
        }
    }
};

/**
 * minor cache implementation
 * @returns {{key: string, cache: *, set: Function, get: Function}}
 */
AjaxConnection.prototype.initCache = function(){
    return {
        /**
         * cache object local storage key
         * @type {String}
         */
        key : 'ajaxConnectionCache',
        /**
         * cache object
         *
         * @type {*}
         */
        cache : null,
        /**
         * sets a key / value pair with a ttl
         *
         * @param {String} key
         * @param {*} value
         * @param {int} ttl
         */
        set : function (key, value, ttl) {
            if (!this.getCache()) {
                this.cache = {};
            }
            if (!ttl) {
                ttl = 15; /*<- minutes*/
            }

            var ts = new Date();
            this.cache[key] = {
                value : value,
                ttl   : ts + (ttl*60)
            };
            window.localStorage.setItem(this.key, JSON.stringify(this.cache));
        },
        /**
         * get a specific key
         * @param {String} key
         * @returns {*}
         */
        get : function (key){
            if (!this.getCache() || this.cache[key] == undefined) {
                return null;
            }
            var ts = new Date();

            if (this.cache[key]['ttl'] <= ts.getTime()) {
                this.invalidate(key);
                return null;
            }

            return this.cache[key];
        },
        /**
         * we clear that key
         * @param key
         */
        invalidate: function(key) {
            if (!this.getCache()) {
                this.cache = {};
            }
            this.cache[key] = null;
            window.localStorage.setItem(this.key, JSON.stringify(this.cache));
        },
        /**
         * removes all the cache
         */
        flush : function() {
            this.cache = {};
            window.localStorage.setItem(this.key, JSON.stringify(this.cache));
        },
        /**
         * loads the cache object
         *
         * @returns {*}
         */
        getCache : function() {
            if (!this.cache) {
                var t = window.localStorage.getItem(this.key);
                if (t) this.cache = JSON.parse(t);
            }
            return this.cache;
        }
    }
};

/**
 * main ajax call
 * @param param
 * @returns {boolean}
 */
AjaxConnection.prototype.ajax = function(param)
{
    if (!param || typeof param != 'object') return false;

    this.data = '';
    this.url = '';

    for (var i in param) {
        if (this[i] == undefined) continue;
        this[i] = param[i];
    }

    if (this.method == '' || this.url == null)
    {
        throw "No method or url set!";
    }

    /*
    this.xhr.timeout = this.timeout;
    this.xhr.withCredentials = this.withCredentials;
    */

    this.xhr.onload = this.onload.bind(this);
    this.xhr.onloadstart = this.onloadstart.bind(this);
    this.xhr.onloadend = this.onloadend.bind(this);
    this.xhr.onabort = this.onabort.bind(this);
    this.xhr.onprogress = this.onprogress.bind(this);
    this.xhr.onerror = this.onerror.bind(this);
    this.xhr.ontimeout = this.ontimeout.bind(this);


    this.parseParam();

    /**
     * cache handle
     */
    if (this.cacheActive && this.cache.get(this.url)){
        this.success(this.cache.get(this.url).value);
        this.cacheActive = false;
        return true;
    }

    this.open(this.method, this.url, this.asynchronous, this.username, this.password);

    if (this.method.toLowerCase() == 'post' && !this.raw) {
        this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        this.headers['Connection'] = "close";
    }


    if (this.headers)
    {
        for (var i in this.headers) {
            if (typeof i != "string") continue;
            this.setRequestHeader(i, this.headers[i]);
        }
    }

    this.setRequestHeader('Content-Length', this.data.length);

    this.send(this.data);

    return true;
};

/**
 * checks if its a raw data request
 * so it only builds the query string if it's a common POST / GET
 *
 * @return void
 */
AjaxConnection.prototype.parseParam = function() {
    /* return if the data is empty */
    if (this.data == '') return;

    if (typeof this.data == 'string') {
        if(this.data.indexOf('?') == -1) {
            this.data = '?' + this.data;
        }
    }

    if (!this.raw) {
        var data_string = (this.method != 'post') ? '?' : '';
        for (var i in this.data) {
            data_string += i + '=' + this.data[i] + '&';
        }

        this.data = data_string.substr(0, data_string.length-1);
    } else {
        this.data = JSON.stringify(this.data);
    }
};

/**
 * abort the current xhr request
 * @returns {*}
 */
AjaxConnection.prototype.abort = function(){
    return this.xhr.abort();
};

/**
 * get all response headers
 *
 * @returns {string}
 */
AjaxConnection.prototype.getAllResponseHeaders = function(){
    return this.xhr.getAllResponseHeaders();
};

/**
 * get response header
 *
 * @param string
 * @returns {string}
 */
AjaxConnection.prototype.getResponseHeader = function(string){
    return this.xhr.getResponseHeader(string);
};

/**
 * opens a connection (defines the target and the how)
 *
 * @param method
 * @param url
 * @param async
 * @param user
 * @param password
 */
AjaxConnection.prototype.open = function(method, url, async, user, password) {
    return this.xhr.open(method, url, async, user, password);
};

/**
 * override the responding mime type
 *
 * @param string
 */
AjaxConnection.prototype.overrideMimeType = function(string) {
    return this.xhr.overrideMimeType(string);
};

/**
 * send the request to the actual target
 *
 * @param data
 * @returns {*}
 */
AjaxConnection.prototype.send = function(data) {
    this.xhr.send(data);
};

/**
 * set specific request headers
 *  -> like nocache etc
 *
 * @param header
 * @param value
 * @returns {*}
 */
AjaxConnection.prototype.setRequestHeader = function(header, value) {
    return this.xhr.setRequestHeader(header, value);
};