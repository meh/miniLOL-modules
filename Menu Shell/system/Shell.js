/*********************************************************************
*           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE              *
*                   Version 2, December 2004                         *
*                                                                    *
*  Copyleft meh.                                                     *
*                                                                    *
*           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE              *
*  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION   *
*                                                                    *
*  0. You just DO WHAT THE FUCK YOU WANT TO.                         *
*********************************************************************/

(function () {

var Shell = Class.create({
    initialize: function (root, commands) {
        this.root = root;

        var This = this;
        this.resource = new miniLOL.Resource("Menu Shell", {
            load: function (path) {
                This._commands = this._data;

                new Ajax.Request(path, {
                    method: "get",
                    asynchronous: false,
        
                    onSuccess: function (http) {
                        if (miniLOL.Document.check(http.responseXML, path)) {
                            return;
                        }

                        var commands = http.responseXML.documentElement.getElementsByTagName("command");

                        for (var i = 0; i < commands.length; i++) {
                            var name = commands[i].getAttribute("name");

                            try {
                                This._commands[name]        = new Function(commands[i].firstChild.nodeValue);
                                This._commands[name].length = commands[i].getAttribute("length");
                                
                            }
                            catch (e) {
                                miniLOL.error("Error while creating `#{name}` wrapper from #{path}:<br/><br/>#{error}".interpolate({
                                    name:  name,
                                    path:  path,
                                    error: e.toString()
                                }));

                                return;
                            }
                        }
                    },
        
                    onFailure: function (http) {
                        miniLOL.error("Error while loading #{path} (#{error})".interpolate({
                            path:  path,
                            error: http.status
                        }));
                    }
                });

                if (miniLOL.error()) {
                    return false;
                }

                return true;

            }
        });

        miniLOL.resource.load(this.resource, this.root+commands);

        this._variables = {
            PWD: '/'
        };

        this.Template = miniLOL.utils.require(this.root+"/system/Template.js");
        this.template = new this.Template("template", this.root+"/resources");
    },

    execute: function (command) {
        var parsed  = this.parse(command);

        if (!parsed) {
            return false;
        }

        var command    = parsed.command;
        var parameters = parsed.parameters;

        if (!this._commands[command]) {
            var link = this.treeUrl(command);
            if (link) {
                miniLOL.go(link);
            }
            else {
                return false;
            }
        }

        if (parameters.length < this._commands[command].length) {
            return "#{command}: needs #{length} parameters.".interpolate({
                command: command,
                length: this._commands[command].length
            });
        }

        return this._commands[command].apply(this, parameters);
    },

    parse: function (command) {
        var matches = command.match(/^(\w+)( (.*))?$/);

        if (!matches) {
            return null;
        }

        var result = {
            command:    matches[1],
            parameters: []
        };

        var params = matches[3];
        if (!params) {
            return result;
        }

        var inString = false;
        var command  = '';
        for (var i = 0; i < params.length; i++) {
            if (params[i] == '\\') {
                command += params[++i];
            }
            else if (params[i] == '"') {
                if (inString) {
                    inString = false;
                }
                else {
                    inString = true;
                }
            }
            else if (params[i] == ' ' && !inString) {
                result.parameters.push(command);
                command = '';
            }
            else {
                command += params[i];
            }
        }

        result.parameters.push(command);

        return result;
    },

    context: function () {
        return {
            menu:      this._menu,
            commands:  this._commands,
            variables: this._variables
        };
    },

    set: function (name, value) {
        if (!name) {
            throw new Error("No name given.");
        }

        if (value === null) {
            delete this._variables[name];
        }
        else {
            this._variables[name] = value
        }
    },

    menu: function (menu) {
        if (!menu) {
            throw new Error("The menu can't be null.");
        }

        this._menu = menu;
    },

    tree: function () {
        
    }
});

return Shell;

})();
