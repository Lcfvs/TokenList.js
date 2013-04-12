TokenList.js
============

An ECMAScript tokenizer
-----------------------

This project is a tokenizer under the LGPL 3.0 license (http://www.gnu.org/licenses/lgpl-3.0.txt).

It consists in a usefull tool to create a parser.

It allows you to define your own keywords.

It supports Space, Comment, Spread (ES6), Namespace, Label, Keyword, Number, String, RegExp, Quasis (ES6) & Symbol tokens.

Compatible with https://github.com/Lcfvs/Sandbox.js


Syntax :
--------

<strong>new self.TokenList(filename, source);</strong>


Arguments :
-----------

[required] String <strong>filename</strong> : the file url<br />
[required] String <strong>source</strong> : the file content<br />


The TokenList properties :
------------------------

Function <strong>addKeywords</strong> : the function to add a list of keywords<br />


Compatibility :
---------------

ECMAScript 3rd Edition +
