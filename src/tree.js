"use strict";

function Node( data )
{
    this.data = data;
    this.parent = null;
    this.children = [];
}

function Tree( data )
{
    var node = new Node( data );
    this.root = node;
}

module.exports.Node = Node;
module.exports.Tree = Tree;