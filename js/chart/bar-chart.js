// Bar Chart
// Ref. https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4

var bar_chart = {
    draw: function( data, x_name, value, map )
    {
        data.forEach( function( d ) { d.count = +d.count; });

        var margin = {top: 40, right: 20, bottom: 30, left: 40},
            width = 1150 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scaleBand().range( [ 0, width ] ).padding(0.1);
        var y = d3.scaleLinear().range( [ height, 0 ]);

        var prev = document.getElementById( "show-barc" );
        if( prev != null ) prev.remove();
        var svg = d3.select( "#bar" ).append( "svg" )
            .attr( "id", "show-barc" )
            .attr( "width", width + margin.left + margin.right )
            .attr( "height", height + margin.top + margin.bottom + 50 )
            .append( "g" )
            .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

        x.domain( data.map( function( d ) { return (parseInt(d.group - 10) + "-" + d.group); } ) );
        y.domain( [ 0, d3.max( data, function( d ) { return d.count; } ) ] );

        // add the x axis
        svg.append( "g" )
            .attr( "transform", "translate(0," + height + ")" )
            .style( "color", "white" )
            .call( d3.axisBottom( x ) );

        // add the y axis
        svg.append( "g" ).call( d3.axisLeft( y ) );

        // text label for the x axis
        svg.append( "text" ).attr( "id", "x-label" )
            .attr( "transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")" )
            .attr( "x", 0 - (height / 2) )
            .attr( "y", 0 - (margin.left) + 20 )
            .attr( "dx", "1em" )
            .style( "fill", "white" )
            .style("text-anchor", "middle")
            .text( x_name );

        // text label for the y axis
        svg.append( "text" )
            .attr( "transform", "rotate( -90 )" )
            .attr( "x", 0 - (height / 2) - 10 )
            .attr( "y", 0 - (margin.left) )
            .attr( "dy", "1em" )
            .style( "fill", "white" )
            .style( "font-weight", "bold" )
            // this makes it easy to center the text as the transform is applied to the anchor
            .style( "text-anchor", "middle" )
            .text( "Numbers" );

        // append the rectangles for the bar chart
        var bar_tool = d3.select( "body" ).append( "div" ).attr( "class", "tool-tip" );
        svg.selectAll( ".bar" )
            .data( data )
            .enter().append("rect")
            .attr( "data", x_name )
            .attr( "class", "bar" )
            .attr( "x", function( d ) { return x( (parseInt(d.group - 10) + "-" + d.group) ); } )
            .attr( "width", x.bandwidth() )
            .attr( "y", function( d ) { return y( d.count ); } )
            .attr( "height", function( d ) { return height - y( d.count ); } )
            .on( 'mouseover', function( d )
            {
                bar_tool.style( "left", d3.event.pageX - 70 + "px" )
                    .style( "top", d3.event.pageY - 75 + "px" )
                    .style( "opacity", 0.9 )
                    .style( "transition", "0.2s" )
                    .html( "<bold>" + (d.group - 9) + " - " + d.group + "</bold><br>Total: <span>" + (d.count) + "</span>" );
                    bar_tool.style( "visibility", "visible" );
            })
            .on( "mouseout", function( d ) {
                bar_tool.style( "visibility", "hidden" );
                bar_tool.style( "top" , 0 );
            })
            .on( 'click', function( d ) 
            {
                var list = document.getElementById( "bar-list" );
                var pos = $("#show-barc").position();

                list.style.top = pos.top;
                list.style.left = pos.left + 595;
                list.style.width = 500;
                list.style.height = 500;
                list.style.display = "block";

                list = document.getElementById( "bar-list-show" );
                list.style.width = 500;
                list.style.height = 450;
                list.style.display = "flex";
                list.innerHTML = "";

                var blgn = document.getElementById( "b-list-g-name" );
                blgn.innerHTML = "<bold class='text-white'>Pokemon Attack Between <italic>" + (parseInt(d.group) - 9) + "-" + d.group + "</italic></bold>";

                var arr = map.get( String(d.group) ).get( "nums" );
                arr.sort( (a, b) => (a - b) );
                for( var i = 0 ; i < arr.length ; i++ )
                {
                    var index = parseInt(arr[ i ]) - 1;
                    list.appendChild( create_pokeitem( pokemonset[ index ], "", refresh_dashboard ) );
                }
            });

        // added fixed tooltip
        var ofst = cal_offset( value );
        var prev = document.getElementById( "show-hint" );
        if( prev != null ) prev.remove();
        var tooltip = d3.select( "#bar" ).append( "div" ).attr( "class", "tool-tip" );
        var tpos;
        $( ".bar" ).each( function( index )
        {
            if( index == ofst )
                tpos = $(this).position();
        });
        tooltip.attr( "id", "show-hint" )
            .style( "left", tpos.left - 124 + "px" )
            .style( "top", tpos.top + 50 + "px" )
            .style( "opacity", 0.9 )
            .style( "transition", "0.5s" )
            .style( "visibility", "visible" )
            .html( "This Pokemon belongs here." );
    }
};

function cal_offset( value )
{
    var ofst = (parseInt((parseInt(value) / 10)) + 1);
    if( (parseInt(value) % 10) == 0 ) ofst -= 1;
    return ofst;
}

function refresh_dashboard( event )
{
    var el = event.target;
    find_pokemon( event );
    close_detail( "bar" );
}