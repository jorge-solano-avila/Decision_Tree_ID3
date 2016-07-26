var node = require('./tree').node;
var tree = require('./tree').tree;

data =
{
    attributes :
    {
        gender : ['male', 'male', 'female', 'female', 'male', 'male', 'female', 'female', 'male', 'female'],
        carOwnership : [0, 1, 1, 0, 1, 0, 1, 1, 2, 2],
        travelCost : ['cheap', 'cheap', 'cheap', 'cheap', 'standard', 'standard', 'expensive', 'expensive', 'expensive'],
        incomeLevel : ['low', 'medium', 'medium', 'low', 'medium', 'medium', 'medium', 'high', 'medium', 'high']
    },
    results : ['bus', 'bus', 'train', 'bus', 'bus', 'train', 'train', 'car', 'car', 'car']
};

var entropy = function( probabilities )
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

var aux = division( data.results );
var result = aux.result;
var probabilities = aux.probabilities;

var entropy = entropy( probabilities );