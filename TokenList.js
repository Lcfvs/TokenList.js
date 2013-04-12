(function () {
    'use strict';
    var keywords, TokenList, parseToken, Space, Comment, Namespace, Label, Keyword, Number, String, RegExp, Symbol;
    keywords = {
        'if': true,
        'else': true,
        'while': true,
        'for': true,
        'switch': true,
        'do': true,
        'break': true,
        'continue': true,
        'try': true,
        'catch': true,
        'finally': true,
        'throw': true,
        'new': true,
        'delete': true,
        'var': true,
        'const': true,
        'let': true,
        'case': true,
        'default': true,
        'in': true,
        'typeof': true,
        'instanceof': true,
        'true': true,
        'false': true,
        'void': true,
        'null': true,
        'undefined': true,
        'NaN': true,
        'Infinity': true,
        'class': true,
        'interface': true,
        'namespace': true,
        'extends': true,
        'implements': true,
        'public': true,
        'protected': true,
        'private': true,
        'final': true,
        'abstract': true,
        'static': true,
        'super': true
    };
    TokenList = function TokenList(source) {
        var tokens, line, chrKey, chr, chrCode, nextChr, Tokenizer, lastToken, lastBlackValue, value;
        tokens = [];
        line = 1;
        chrKey = 0;
        chr = source[chrKey];
        while (chr !== undefined) {
            nextChr = source[chrKey + 1];
            chrCode = chr.charCodeAt(0);
            if (chr === '\n' || chr === ' ' || chr === '\r' || chr === '\t') {
                Tokenizer = Space;
            } else if (chr === '/' && (nextChr === '/' || nextChr === '*')) {
                Tokenizer = Comment;
            } else if (chr === '/' && (lastBlackValue === '+' || lastBlackValue === ',' || lastBlackValue === '[' || (lastBlackValue === 'typeof' && lastToken instanceof Space) || lastBlackValue === ':' || lastBlackValue === '=' || lastBlackValue === '(' || lastBlackValue === '?')) {
                Tokenizer = RegExp;
            } else if (chr === '\'' || chr === '"') {
                Tokenizer = String;
            } else if (chrCode === 36 || (chrCode > 64 && chrCode < 91) || chrCode === 95 || (chrCode > 96 && chrCode < 123)) {
                Tokenizer = Label;
            } else if ((chr === '\\' && nextChr === '\\') || (chr === ':' && nextChr === ':') || (chr === '.' && nextChr === '.')) {
                Tokenizer = Namespace;
            } else if ((chrCode > 47 && chrCode < 58) || (chr === '-' && (nextChr === '0' || nextChr === '1' || nextChr === '2' || nextChr === '3' || nextChr === '4' || nextChr === '5' || nextChr === '6' || nextChr === '7' || nextChr === '8' || nextChr === '9'))) {
                Tokenizer = Number;
            } else {
                Tokenizer = Symbol;
            }
            lastToken = parseToken(source.substring(chrKey), line, chrKey, Tokenizer);
            if (!(lastToken instanceof Space) && !(lastToken instanceof Comment)) {
                lastBlackValue = lastToken.value;
            }
            value = lastToken.value;
            if (value === undefined) {
                throw new ReferenceError('Invalid ' + lastToken.type + ' token');
            } else {
                if (Tokenizer === Space || Tokenizer === Comment) {
                    line += value.split('\n').length - 1;
                }
                lastToken.line = line;
                chrKey += value.length;
            }
            tokens.push(lastToken);
            chr = source[chrKey];
        }
        this.getItem = function (tokenKey) {
            return tokens[tokenKey];
        };
        this.length = tokens.length;
    };
    parseToken = function parseToken(source, line, pos, Tokenizer) {
        var args, token;
        args = source.match(Tokenizer.pattern) || [];
        token = new Tokenizer(args[1], args[2]);
        token.type = token.constructor.name;
        token.line = line;
        token.pos = pos;
        return token;
    };
    Space = function Space(comment) {
        this.value = comment;
    };
    Comment = function Comment(comment) {
        this.value = comment;
    };
    Namespace = function Namespace(ns) {
        this.value = ns;
    };
    Label = function Label(word) {
        var returnValue;
        if (!keywords.hasOwnProperty(word)) {
            returnValue = this;
            this.value = word;
        } else {
            returnValue = new Keyword(word);
        }
        return returnValue;
    };
    Keyword = function Keyword(keyword) {
        this.value = keyword;
    };
    Number = function Number(number) {
        this.value = number;
    };
    String = function String(str) {
        this.value = str;
    };
    RegExp = function RegExp(regExp, flags) {
        this.value = regExp !== undefined && (flags === undefined || (flags.indexOf('g') === flags.lastIndexOf('g') && flags.indexOf('m') === flags.lastIndexOf('m') && flags.indexOf('i') === flags.lastIndexOf('i') && flags.indexOf('y') === flags.lastIndexOf('y'))) ? regExp : undefined;
    };
    Symbol = function Symbol(symbol) {
        this.value = symbol;
    };
    TokenList.addKeywords = function () {
        var key, length, keyword;
        key = 0;
        length = arguments.length;
        while (key < length) {
            keyword = arguments[key];
            if (!keywords.hasOwnProperty(keyword)) {
                keywords[keyword] = true;
            }
        }
    };
    Space.pattern = /^(\s+)/;
    Comment.pattern = /^((?:\/\/[^\n]*\n)|(?:\/\*.+\*\/))/;
    Namespace.pattern = /^((?:(?:(?:(?:::)|(?:\.\.\\)|(?:\\))\w[\w\d]*)(?:\\(?:(?:\.\.)|(?:\w[\w\d]*)))*)|(?:::)|(?:\\)|(?:\.\.\\))/;
    Label.pattern = /^([\w_$][\w\d_$]*)/;
    Number.pattern = /^(-?(?:(?:0x[\da-f]+)|(?:(?:(?:0|(?:[1-9]\d*))|(?:(?:0|(?:[1-9]\d*))?\.\d+))(?:e-?\d+)?)))/i;
    String.pattern = /^((?:'[^\n]*?[^\\](?:\\\\)*')|(?:"[^\n]*?[^\\](?:\\\\)*"))/;
    RegExp.pattern = /^(\/[^\n\r]*?[^\\](?:\\\\)*\/([gmiy]{0,4})?)/;
    Symbol.pattern = /^([!=]==?|\|{1,2}|&{1,2}|<{2}|>{2,3}|\+{2}|\-{2}|[+\-%^*\/<>]=?|!+|[~\.{}\[\]:?,=;])/;
    self.TokenList = TokenList;
}());
