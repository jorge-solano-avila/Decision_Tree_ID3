var Node = require( "./tree" ).Node;
var Tree = require( "./tree" ).Tree;

var maxGain = function( gain )
{
    var max = 0;
    var result = "";
    for( var attribute in gain )
    {
        result = attribute;
        max = gain[attribute];
        break;
    }
    for( var attribute in gain )
        if( gain[attribute] > max )
        {
            max = gain[attribute];
            result = attribute;
        }

    return result;
};

var entropy = function( probabilites )
{
    var entropy = 0;

    for( var probability in probabilities )
        entropy += probabilities[probability] * Math.log2( probabilities[probability] );

    return -entropy;
};

var division = function( results )
{
    broken = false;
    result = [];
    probabilities = {};

    for( var i = 0; i < results.length; ++i )
    {
        for( var j = 0; j < result.length; ++j )
            if( result[j] === results[i] )
            {
                broken = true;
                break;
            }
        if( !broken )
        {
            result.push( results[i] );
            probabilities[results[i]] = 1;
        }
        else
        {
            ++probabilities[results[i]];
            broken = false;
        }
    }

    for( var probability in probabilities )
        probabilities[probability] /= results.length;

    return {
        result : result,
        probabilities : probabilities
    };
};

var values = function( data )
{
    var result = {};

    for( var attribute in data.attributes )
    {
        result[attribute] = [];
        for( var i = 0; i < data.attributes[attribute].length; ++i )
        {
            var value = data.attributes[attribute][i];
            var equal = false;
            for( var j = 0; j < result[attribute].length; ++j )
            {
                if( value === result[attribute][j] )
                {
                    equal = true;
                    break;
                }
            }
            if( !equal )
                result[attribute].push( value );
        }
    }

    return result;
};

var isRoot = true;
var treeID3 = null;

var buildTree = function( parentT, tree, indexT, data ) 
{
    var aux = division( data.results );
    var probabilities = aux.probabilities;

    var entropyTotal = entropy( probabilities );
    var gain = {};

    for( var attribute in data.attributes )
    {
        var sum = 0;
        var valuesD = division(data.attributes[attribute]).result;

        for( var i = 0; i < valuesD.length; ++i )
        {
            var partials = [];

            for( var j = 0; j < data.attributes[attribute].length; ++j )
                if( data.attributes[attribute][j] === valuesD[i] )
                    partials.push( data.results[j] );

            var temp = division( partials );
            var temp2 = entropy( temp.probabilities );
            sum += partials.length / data.results.length * temp2;
        }

        gain[attribute] = entropyTotal - sum;
    }

    if( isRoot )
    {
        var max = maxGain( gain );
        var valuesR = values( data )[max];

        treeID3 = new Tree( max );
        isRoot = false;
        for( var i = 0; i < valuesR.length; ++i )
        {
            var value = null;
            var flag = false;
            var next = false;

            treeID3.root.children.push( new Node( valuesR[i] ) );
            treeID3.root.children[i].parent = treeID3;

            for( var j = 0; j < data.attributes[max].length; ++j )
                if( data.attributes[max][j] === valuesR[i] )
                    if( !flag )
                    {
                        value = data.results[j];
                        flag = true;
                    }
                    else if( data.results[j] !== value )
                    {
                        next = true;
                        break;
                    }
            if( next )
            {
                var dataAux = JSON.parse( JSON.stringify( data ) );

                for( var j = 0; j < dataAux.results.length; ++j )
                    if( valuesR[i] !== dataAux.attributes[max][j] )
                    {
                        for( var attribute in dataAux.attributes )
                            dataAux.attributes[attribute].splice( j, 1 );
                        dataAux.results.splice( j, 1 );
                        --j;
                    }
                delete dataAux.attributes[max];

                buildTree( treeID3.root.children[i], treeID3.root.children[i].children, 0, dataAux );
            }
            else
            {
                treeID3.root.children[i].children.push( new Node( value ) );
                treeID3.root.children[i].children[0].parent = treeID3.root.children[i];
            }
        }
    }
    else
    {
        var max = maxGain( gain );
        var valuesR = values( data )[max];

        tree.push( new Node( max ) );
        tree[indexT].parent = parentT;

        if( valuesR !== undefined )
            for( var i = 0; i < valuesR.length; ++i )
            {
                var value = null;
                var flag = false;
                var next = false;

                tree[indexT].children.push( new Node( valuesR[i] ) );
                tree[indexT].children[i].parent = tree[indexT];

                for( var j = 0; j < data.attributes[max].length; ++j )
                    if( data.attributes[max][j] === valuesR[i] )
                        if( !flag )
                        {
                            value = data.results[j];
                            flag = true;
                        }
                        else if( data.results[j] !== value )
                        {
                            next = true;
                            break;
                        }
                if( next )
                {
                    var dataAux = JSON.parse( JSON.stringify( data ) );
                    for( var j = 0; j < dataAux.results.length; ++j )
                        if( valuesR[i] !== dataAux.attributes[max][j] )
                        {
                            for (var attribute in dataAux.attributes)
                                dataAux.attributes[attribute].splice(j, 1);
                            dataAux.results.splice(j, 1);
                            --j;
                        }
                    delete dataAux.attributes[max];

                    buildTree( tree[indexT].children[i], tree[indexT].children[i].children, 0, dataAux );
                }
                else
                {
                    tree[indexT].children[i].children.push( new Node( value ) );
                    tree[indexT].children[i].children[0].parent = tree[indexT].children[i];
                }
            }
    }
};