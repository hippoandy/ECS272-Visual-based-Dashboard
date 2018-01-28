// Scatter Chart
// https://bl.ocks.org/d3noob/6f082f0e3b820b6bf68b78f2f7786084

function scatter_chart( attr1, attr2 )
{
    // prepare the data
    var data = create_data( attr1, attr2 );

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 50, left: 80 },
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range( [ 0, width ] );
    var y = d3.scaleLinear().range( [ height, 0 ] );

    // format the data
    data.forEach( function( d ) {
        d.A = +d.A;
        d.B = +d.B;
    });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select( "#vis2" ).append( "svg" )
        .attr( "class", "float-left" )
        .attr( "width", width + margin.left + margin.right )
        .attr( "height", height + margin.top + margin.bottom )
        .append( "g" )
        .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

    // Scale the range of the data
    x.domain( d3.extent( data, function( d ) { return d.A; } ) );
    y.domain( [ 0, d3.max( data, function( d ) { return d.B; } ) ] );
        
    // add the scatterplot
    svg.selectAll( "dot" )
        .data( data )
        .enter().append( "circle" )
        .attr( "class", "dot" )
        .attr( "fill", function( d ) {
            chk = parseInt(d.CP);
            if( chk <= 360 )
                return "red";
            else if( chk > 360 && chk <= 540 )
                return "yellow";
            else
                return "green";
        })
        .attr( "r", 5 )
        .attr( "cx", function( d ) { return x( d.A ); } )
        .attr( "cy", function( d ) { return y( d.B ); } );
        // .on( "mouseover", function( d )
        // {
        //     var color = $(this).attr( "fill" );
        //     $( ".dot" ).each( function( index )
        //     {
        //         if( $(this).attr( "fill" ) == color )
        //         {
        //             $(this).animate(
        //             {
        //                 opacity: 0.5
        //             }, 500, function() {});
        //         }
        //     });
        // })
        // .on( "mouseout", function( d )
        // {
        //     var color = $(this).attr( "fill" );
        //     $( ".dot" ).each( function( index )
        //     {
        //         if( $(this).attr( "fill" ) == color )
        //         {
        //             $(this).animate(
        //             {
        //                 opacity: 1
        //             }, 500, function() {});
        //         }
        //     });
        // })
        // .on( "mouseout", function( d )
        // {
        //     console.log( "hi!" );
        // });

    // add the x axis
    svg.append( "g" )
        .attr( "transform", "translate( 0, " + height + ")" )
        .style( "color", "white" )
        .call( d3.axisBottom( x ) );

    // add the y axis
    svg.append( "g" )
        .style( "color", "white" )
        .call( d3.axisLeft( y ) );

    // text label for the x axis
    svg.append( "text" ).attr( "id", "x-label" )
        .attr( "transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")" )
        .attr( "x", 0 - (height / 2) )
        .attr( "y", 5 )
        .attr( "dx", "1em" )
        .style( "fill", "white" )
        .style("text-anchor", "middle")
        .text( attr1 );

    // text label for the y axis
    svg.append( "text" )
        .attr( "transform", "rotate( -90 )" )
        .attr( "x", 0 - (height / 2) - 10 )
        .attr( "y", 0 - 55 )
        .attr( "dy", "1em" )
        .style( "fill", "white" )
        .style( "font-weight", "bold" )
        // this makes it easy to center the text as the transform is applied to the anchor
        .style( "text-anchor", "middle" )
        .text( attr2 );
}

function create_data( attr1, attr2 )
{
    var data = [];
    for( var i = 0 ; i < pokemonset.length ; i++ )
        data.push( { "A": pokemonset[ i ][ attr1 ], "B": pokemonset[ i ][ attr2 ], "CP": pokemonset[ i ].Total  } );
    return data;
}