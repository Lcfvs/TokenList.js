(function () {
    'use strict';
    var keywords, TokenList, parseToken, Space, Comment, Spread, Namespace, Label, Keyword, Number, String, RegExp, Quasis, Symbol;
    keywords = {};
    TokenList = function TokenList(fileName, source) {
        var tokens, line, chrKey, chr, chrCode, nextChr, Tokenizer, lastToken, lastBlackValue, value;
        tokens = [];
        line = 1;
        chrKey = 0;
        chr = source[chrKey];
        while (chr !== undefined) {
            nextChr = source[chrKey + 1];
            chrCode = chr.charCodeAt(0);
            if (chr === ' ' || chr === '\t' || chr === '\n' || chr === '\r') {
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
                Tokenizer = chr === '.' && source[chrKey + 2] === '.' ? Spread : Namespace;
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
                throw new ReferenceError('Invalid ' + lastToken.type + ' token', fileName, line);
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
        token = new Tokenizer(source, line, pos, args[1], args[2]);
        if (token.type === undefined) {
            token.type = token.constructor.name;
            token.line = line;
            token.pos = pos;
        }
        return token;
    };
    Space = function Space(source, line, pos, comment) {
        this.value = comment;
    };
    Comment = function Comment(source, line, pos, comment) {
        this.value = comment;
    };
    Spread = function Spread(source, line, pos, spread) {
        this.value = spread;
    };
    Namespace = function Namespace(source, line, pos, ns) {
        this.value = ns;
    };
    Label = function Label(source, line, pos, word) {
        var backQuote, returnValue;
        backQuote = source[word.length];
        if (keywords.hasOwnProperty(word)) {
            returnValue = new Keyword(source, line, pos, word);
        } else if (backQuote === '`') {
            returnValue = parseToken(source, line, pos, Quasis);
        } else {
            returnValue = this;
            this.value = word;
        }
        return returnValue;
    };
    Keyword = function Keyword(source, line, pos, keyword) {
        this.value = keyword;
    };
    Number = function Number(source, line, pos, number) {
        this.value = number;
    };
    String = function String(source, line, pos, str) {
        this.value = str;
    };
    RegExp = function RegExp(source, line, pos, regExp, flags) {
        this.value = regExp !== undefined && (flags === undefined || (flags.indexOf('g') === flags.lastIndexOf('g') && flags.indexOf('m') === flags.lastIndexOf('m') && flags.indexOf('i') === flags.lastIndexOf('i') && flags.indexOf('y') === flags.lastIndexOf('y'))) ? regExp : undefined;
    };
    Quasis = function Quasis(source, line, pos, quasi) {
        this.value = quasi;
    };
    Symbol = function Symbol(source, line, pos, symbol) {
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
    Spread.pattern = /^(\.{3})/;
    Label.pattern = /^([\w_$][\w\d_$]*)/;
    Number.pattern = /^(-?(?:(?:0x[\da-f]+)|(?:(?:(?:0|(?:[1-9]\d*))|(?:(?:0|(?:[1-9]\d*))?\.\d+))(?:e-?\d+)?)))/i;
    String.pattern = /^((?:'[^\n]*?[^\\](?:\\\\)*')|(?:"[^\n]*?[^\\](?:\\\\)*"))/;
    RegExp.pattern = /^(\/[^\n\r]*?[^\\](?:\\\\)*\/([gmiy]{0,4})?)/;
    Quasis.pattern = /([\w_$][\w\d_$]*`[^\n]*?[^\\](?:\\\\)*`)/;
    Symbol.pattern = /^([!=]==?|\|{1,2}|&{1,2}|<{2}|>{2,3}|\+{2}|\-{2}|[+\-%^*\/<>]=?|!+|[~\.{}\[\]:?,=;])/;
    self.TokenList = TokenList;
}());
