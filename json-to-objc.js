!function(root) {
    'use strict';

    var OBJC_NULL = '[NSNull null]',
        defaults = function(obj, default_value) {
            return typeof obj !== 'undefined' ? obj : default_value;
        },
        // Taken from http://stackoverflow.com/a/5450113
        repeat = function(str, count) {
            var result = '';
            var pattern = '';

            if (count < 1) {
                return result;
            }

            pattern = str.valueOf();

            while (count > 1) {
                if (count & 1) {
                    result += pattern;
                }
                count >>= 1, pattern += pattern;
            }

            return result + pattern;
        };

    Object.prototype.toObjC = function(current_indent_level, single_indent) {
        var current_indent = '';
        var next_indent_level = 0;
        var next_indent = '';
        var dict_begin = '';
        var dict_end = '';
        var separator = '';
        var token_array = [];
        var index = 0;
        var length = 0;
        var key = '';
        var value = null;
        var key_string = '';
        var value_string = '';

        single_indent = defaults(single_indent, '    ');

        current_indent_level = defaults(current_indent_level, 0);
        current_indent = single_indent.repeat(current_indent_level);

        next_indent_level = current_indent_level + 1;
        next_indent = single_indent.repeat(current_indent_level + 1);

        dict_begin = '@{\n' + next_indent;
        dict_end = '\n' + current_indent + '}';

        separator = ',\n' + next_indent;

        for (key in this) {
            if (this.hasOwnProperty(key)) {
                key_string = key.toObjC(next_indent_level, single_indent);
                value = this[key];
                value_string = OBJC_NULL;

                if (value !== null) {
                    value_string = this[key].toObjC(next_indent_level, single_indent);
                }

                token_array.push(key_string + ': ' + value_string);
            }
        }

        return dict_begin + token_array.join(separator) + dict_end;
    }

    Array.prototype.toObjC = function(current_indent_level, single_indent) {
        var current_indent = '';
        var next_indent_level = 0;
        var next_indent = '';
        var array_begin = '';
        var array_end = '';
        var separator = '';
        var token_array = [];
        var index = 0;
        var length = 0;
        var value = null;
        var value_string = '';

        single_indent = typeof single_indent !== 'undefined' ? single_indent : '    ';

        current_indent_level = typeof current_indent_level !== 'undefined' ? current_indent_level : 0;
        current_indent = single_indent.repeat(current_indent_level);

        next_indent_level = current_indent_level + 1;
        next_indent = single_indent.repeat(current_indent_level + 1);

        array_begin = '@[\n' + next_indent;
        array_end = '\n' + current_indent + ']';

        separator = ',\n' + next_indent;

        for (index = 0, length = this.length; index < length; ++index) {
            value = this[index],
            value_string = OBJC_NULL;

            if (value !== null) {
                value_string = value.toObjC(next_indent_level, single_indent);
            }

            token_array.push(value_string);
        }

        return array_begin + token_array.join(separator) + array_end;
    }

    String.prototype.toObjC = function() {
        var strings = this.split('\\"');
        var index = 0;
        var length = 0;
        var string = '';

        for (index = 0, length = strings.length; index < strings.length; ++index) {
            strings[index] = strings[index].replace(/"/g, '\\"');
        }

        return '@"' + strings.join('\\"') + '"';
    }

    Boolean.prototype.toObjC = function() {
        return this ? '@YES' : '@NO';
    }

    Number.prototype.toObjC = function() {
        return '@' + this.toString();
    }
}(this);
