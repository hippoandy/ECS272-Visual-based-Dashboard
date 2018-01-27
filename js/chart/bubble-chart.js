// Bubble Chart

function bubble_chart( data, type_st )
{
    // Constants
    var diameter = 700,
    format = d3.format( ",d" );

    // Define svg object
    var svg = d3.select( "#vis1" ).append( "svg" )
    .attr( "width", diameter )
    .attr( "height", diameter )
    .attr( "class", "bubble" );

    // Define 'div' for tooltips
    var div = d3.select( "#vis1" )
    // declare the tooltip div 
    .append( "div" )
    .attr( "class", "tooltip" )
    .style( "opacity", 0 );

    // Define a bubble object with attributes
    var bubble = d3.pack()
        .size( [diameter, diameter] )
        .padding( 1.5 );

    var nodes = d3.hierarchy( {children: type_st} ).sum( function( d ) { return d.Amount; } );

    var node = svg.selectAll( ".node" )
        .data( bubble( nodes ).descendants() )
        .enter().filter( function(d) {
            return  !d.children
        }).append( "g" )
        .attr( "class", "node" )
        .attr( "transform", function( d ) { return "translate(" + d.x + "," + d.y + ")"; } );

    node.append( "circle" )
        .attr("r", function( d ) { return d.r; })
        .style( "stroke", "#727272" )
        .style( "stroke-width", "2px" )
        .style( "fill", function( d ) { return d.data.Color; } );
    
    node.append( "text" )
        .attr("dy", ".3em")
        .text(function(d) {
            return d.data.Type;
        })
        .style( "text-anchor", "middle" )
        .style( "font-weight", "bold" )
        .style( 'fill', function ( d ) {
            switch( d.data.Type )
            {
                case 'Dragon':
                case 'Electric':
                case 'Ghost':
                case 'Normal':
                    return "#282424"
                default:
                    return "#fff";
            }
            // if( this.previousSibling.style.fill == "rgb(255, 255, 255)" )
            //     return "#282424";
        });
    
    // Tooltip for bubble
    node.on( "mouseover", function( d ) {
        div .transition()
            .duration( 100 )
            .style( "visibility", "visible" )
            .style( "opacity", 0.9 )
            .style( "transition", "0.5s" );
        div .html(
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
        {
            if( data[ i ].Type_1 == d.data.Type )
            {
                var ndiv = document.createElement( "div" );
                ndiv.className = "item";
                ndiv.innerHTML = data[ i ].Name;
                var img = document.createElement( "img" );
                img.setAttribute( "src", ("./img/pokemon/" + String(data[ i ].Number) + ".png") );
                img.setAttribute( "style", "padding: 2px;" );
                img.setAttribute( "width", "80px" );
                img.setAttribute( "height", "80px" );
                img.setAttribute( "alt", String(data[ i ].Name) );
                ndiv.appendChild( img );
                list.appendChild( ndiv );
            }
        }
    });
    d3.select( self.frameElement ).style( "height", diameter + "px" );
};