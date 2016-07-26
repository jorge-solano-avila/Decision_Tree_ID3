function node( data )
{
    this.data = data;
    this.parent = null;
    this.children = [];
}

function tree( data )
{
    var node = new node( data );
    this.root = node;
}

module.exports.node = node;
module.exports.tree = tree;