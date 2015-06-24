(function (exports, undefined) {
    'use strict';

    var SpelNode;
    try {
        SpelNode = require('./SpelNode').SpelNode;
    } catch (e) {
        SpelNode = exports.SpelNode;
    }

    function createNode(nullSafeNavigation, propertyName, position) {
        var node = SpelNode.create('property', position);

        node.getValue = function (state) {
            var context = state.activeContext.peek();

            if (!context) {
                throw {
                    name: 'ContextDoesNotExistException',
                    message: 'Attempting to look up property \''+ propertyName +'\' for an undefined context.'
                }
            }

            if (context[propertyName] === undefined) {
                //handle safe navigation
                if (nullSafeNavigation) {
                    return null;
                }

                //handle conversion of Java properties to JavaScript properties
                //this might cause problems, I'll look into alternatives
                if (propertyName === 'size') {
                    return context.length;
                }

                throw {
                    name: 'NullPointerException',
                    message: 'Property \'' + propertyName + '\' does not exist.'
                };
            }

            return context[propertyName];
        };

        node.setValue = function (value, state) {
            var context = state.activeContext.peek();

            if (!context) {
                throw {
                    name: 'ContextDoesNotExistException',
                    message: 'Attempting to assign property \''+ propertyName +'\' for an undefined context.'
                }
            }

            return context[propertyName] = value;
        };

        node.getName = function () {
            return propertyName;
        };

        return node;
    }

    exports.PropertyReference = {
        create: createNode
    };

}(window || exports));
