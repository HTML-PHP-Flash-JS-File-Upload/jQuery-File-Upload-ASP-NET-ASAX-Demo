(function (global, factory) {

    if (typeof module === "object" && typeof module.exports === "object") {
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get jQuery.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        module.exports = global.document ?
			factory(global, true) :
			function (w) {
			    if (!w.document) {
			        throw new Error("Requires a window with a document");
			    }
			    return factory(w);
			};
    } else {
        factory(global);
    }

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function (window, noGlobal) {

    var version = "2.3.0",
        backload = null,
        xhr = null;

    // Helper. sets default values if type is undefined
    function def(arg, val) { return typeof arg !== 'undefined' ? arg : val; }
 

    // If Backload is assigned already, do not create a new one
    if (typeof window.Backload !== "undefined") {
        backload = window.Backload;
    }
    else {

        // Create XHR object
        xhr = new function () {

            var _req = (function () {
                var factory = false;
                var _httpFactories = [
                    function () { return new XMLHttpRequest() },
                    function () { return new ActiveXObject("Msxml2.XMLHTTP") },
                    function () { return new ActiveXObject("Msxml3.XMLHTTP") },
                    function () { return new ActiveXObject("Microsoft.XMLHTTP") }
                ];
                for (var i = 0; i < _httpFactories.length; i++) {
                    try {
                        factory = _httpFactories[i]();
                    }
                    catch (e) {
                        continue;
                    }
                    break;
                }
                return factory;
            })();


            this.send = function (parameters, caller, callback) {
                if (!_req) return;
                else if (!parameters.url) return;

                if (!parameters.method) parameters.method = "GET";
                parameters.method = parameters.method.toUpperCase();
                parameters.data = def(parameters.data, null);
                parameters.withCredentials = def(parameters.withCredentials, false);
                parameters.headers = def(parameters.headers, []) || [];

                _req.open(parameters.method, parameters.url, true);

                // Set request parameters
                _req.withCredentials = parameters.withCredentials;
                _req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
                _req.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
                if (parameters.data) req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                for (var i = 0; i < parameters.headers.length; i++)
                    _req.setRequestHeader(parameters.headers[i].name, parameters.headers[i].value);

                // Hook to state change
                _req.onreadystatechange = function () {
                    if ((_req.readyState != 4) || (_req.status != 200 && _req.status != 304)) {
                        return;
                    }
                    var responseObject = null;
                    if ((_req.responseText) && (typeof _req.responseText === 'string'))
                    {
                        //var trimmed = (_req.responseText).replace(/^[\\x20\\t\\r\\n\\f]|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$/g, "");
                        // var headers = _req.getAllResponseHeaders().split("\r\n");
                        var header = _req.getAllResponseHeaders();
                        if ((header.indexOf("application/json") != -1) || (header.indexOf("text/javascript") != -1))
                            responseObject = JSON.parse(_req.responseText);
                    }
                    callback(_req, caller, responseObject);
                };

                if (_req.readyState == 4) return;
                _req.send(parameters.data);
            }
        };


        // Create Backload basic object
        backload = new function () {
            var _window = window;
            var _xhr = xhr;

            this.user = null;
            this.flow = null;
            this.storageContext = null;

        };
    }



    backload.googleDrive = new function () {
        this.version = "2.3.0";
        var _backload = backload;

        // Returns default config request parameters
        this.getDefaultConfigRequestParams = function () {
            return {
                url: "/Backload/ScriptHandler?userId=" + _backload.user,
                method: "GET",
                headers: [],                                  // Array of name/value pairs ([{name: "HEADERNAME", value: "HEADERVALUE"}]
                data: null,
                withCredentials: false
            }
        };


        // Create Google Drive object
        var _initConfig = def(window.GOOGLE_DRIVE_CONFIG, {
            token : null,
            secrets : null,
            user : "g.auersberg@gmail.com",
            flow : "client",
            storageContext : "central"
        });
        this.config = null;
        this.setConfig = function (conf) {
            if (typeof conf === 'undefined') conf = _initConfig;
            this.config = { token: def(conf.token, null), secrets: def(conf.secrets, null) };
            _backload.user = def(conf.user, "");
            _backload.flow = def(conf.flow, "client");
            _backload.storageContext = def(conf.storage, "central");
        };
        this.loadConfig = function (params, autoSet, callback) {
            if (!params) params = this.getDefaultConfigRequestParams();

            xhr.send(params, this, function (response, caller, data) {
                if ((data) && (autoSet)) caller.setConfig(data.config);
                if (callback) callback(caller.config);
            });
        };


        this.ready = (this.config != null && this.config.token != null);

        // Init
        this.setConfig(_initConfig);
    };


    // Assign to window object and return
    window.backload = backload;
    return backload;
}));
