// Bubble Chart
// https://bl.ocks.org/john-guerra/0d81ccfd24578d5d563c55e785b3b40a

function bubble_chart( data, type_st )
{
    // Constants
    var width = 600,
    height = 600,
    format = d3.format( ",d" );

    // Define svg object
    var svg = d3.select( "#vis1" ).append( "svg" )
    .attr( "width", width )
    .attr( "height", height )
    .attr( "class", "bubble" );

    // Define 'div' for tooltips
    var div = d3.select( "#vis1" )
    // declare the tooltip div 
    .append( "div" )
    .attr( "class", "tooltip" )
    .style( "opacity", 0 );

    // Define a bubble object with attributes
    var bubble = d3.pack()
        .size( [ width, height ] )
        .padding( 1.5 );

    var nodes = d3.hierarchy( {children: type_st} ).sum( function( d ) { return d.Amount; } );

    var node = svg.selectAll( ".node" )
        .data( bubble( nodes ).descendants() )
        .enter().filter( function(d) {
            return  !d.children
        }).append( "g" )
        .attr( "class", "node" )
        .attr( "transform", function( d ) { return "translate(" + d.x + "," + d.y + ")"; } );

    // node.append( "circle" )
    //     .attr("r", function( d ) { return d.r; })
    //     .style( "stroke", "#727272" )
    //     .style( "stroke-width", "2px" )
    //     .style( "fill", function( d ) { return d.data.Color; } );

    node.append( "circle" )
        .attr( "class", "pokeball" )
        .attr("r", function( d ) { return d.r; })
        .style( "fill", "url(#poke-gradient)" )
        .style( "stroke", "#232B2B" )
        .style( "stroke-width", "5px" );
    
    node.append( "line" )
        .attr( "dy", "-15px" )
        .attr( 'x1', '0' )
        .attr( 'y1', '0' )
        .attr( 'x2', function() { return this.previousSibling.getAttribute( "r" ); } )
        .attr( 'y2', '0' )
        .style( "stroke", "#232B2B" )
        .style( "stroke-width", "5px" );
    node.append( "line" )
        .attr( "dy", "-15px" )
        .attr( 'x1', function() { return '-' + this.previousSibling.previousSibling.getAttribute( "r" ); } )
        .attr( 'y1', '0' )
        .attr( 'x2', '0' )
        .attr( 'y2', '0' )
        .style( "stroke", "#232B2B" )
        .style( "stroke-width", "5px" );
    node.append( "circle" )
        .attr( "r", function( d ) { return d.r / 3; })
        .style( "fill", "white" )
        .style( "stroke", "#232B2B" )
        .style( "stroke-width", "5px" );
    node.append( "circle" )
        .attr( "r", function( d ) { return d.r / 5; })
        .style( "fill", "white" )
        .style( "stroke", "#232B2B" )
        .style( "stroke-width", "2px" );
    
    node.append( "text" )
        .attr( "dy", "-25px" )
        .text( function(d) { return d.data.Type; })
        .style( "text-anchor", "middle" )
        .style( "font-weight", "bold" )
        .style( 'fill', "white" );
        // .style( 'fill', "#3f3e3e" );
    
    // Tooltip for bubble
    node.on( "mouseover", function( d ) {
        div.transition()
            .duration( 100 )
            .style( "visibility", "visible" )
            .style( "opacity", 0.9 )
            .style( "transition", "0.5s" );
        div.html(
                "<div class=\"text-bold center\">" + d.data.Type + "</div><br>" +
                "Amount: " + d.data.Amount
            )
            .style( "left", (d3.event.pageX) + "px" )
            .style( "top", (d3.event.pageY - 28) + "px" );
    })
    .on( "mouseout", function() {
        return div.style( "visibility", "hidden" );
    })
    .on( "click", function( d ) {
        var list = document.getElementById( "list" );
        list.style.visibility = "visible";
        list.innerHTML = "";
        for( var i = 0 ; i < data.length ; i++ )
            if( data[ i ].Type_1 == d.data.Type )
                list.appendChild( create_pokeitem( data[ i ], "", link_dashboard ) );
        auto_scroll( "#list" );
    });
    d3.select( self.frameElement ).style( "height", height + "px" );
};

function link_dashboard( event )
{
    var el = event.target;
    find_pokemon( event );
    change_color( '#D' );
    open_tab( event, 'dashboard' );
    auto_scroll( "#detail" );
}