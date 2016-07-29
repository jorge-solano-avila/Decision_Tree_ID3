var node = require( "./tree" ).node;
var tree = require( "./tree" ).tree;

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