/*  Prototype JavaScript framework, version 1.7_rc2
 *  (c) 2005-2010 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/

/*
 * Little modifications by meh. [http://meh.doesntexist.org | meh.ffff@gmail.com]
 * to adapt the code to the Security module.
 */

Ajax.Request.addMethods({
    request: function (url) {
        this.url    = url;
        this.method = this.options.method;

        if (Object.isString(this.options.parameters)) {
            this.options.parameters = this.options.parameters.toQueryParams();
        }

        if (this.options.tokenized) {
            this.options.parameters.__token = miniLOL.module.execute('Security', { token: true });
        }

        var params = Object.toQueryString(this.options.parameters);

        if (!['get', 'post', 'head'].include(this.method)) {
            params      += (params ? '&' : '') + "_method=" + this.method;
            this.method  = 'post';
        }

        if (params) {
            // when GET, append parameters to URL
            if (this.method == 'get' || this.method == 'head') {
                this.url += (this.url.include('?') ? '&' : '?') + params;
            }
            else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) {
                params += '&_=';
            }
        }

        this.parameters = params.toQueryParams();

        try {
            var response = new Ajax.Response(this);

            if (this.options.onCreate) {
                this.options.onCreate(response);
            }

            Ajax.Responders.dispatch('onCreate', this, response);

            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);

            if (this.options.asynchronous) {
                this.respondToReadyState.bind(this).defer(1);
            }

            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.setRequestHeaders();

            this.body = this.method == 'post' ? (this.options.postBody || params) : null;
            this.transport.send(this.body);

            /* Force Firefox to handle ready state 4 for synchronous requests */
            if (!this.options.asynchronous && this.transport.overrideMimeType) {
                this.onStateChange();
            }
        }
        catch (e) {
            this.dispatchException(e);
        }
    }
});
