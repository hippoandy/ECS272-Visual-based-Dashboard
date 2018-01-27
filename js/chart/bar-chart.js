// Bar Chart
// Ref. https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4

var bar_chart = {
    draw: function( data, x_name, value )
    {
        data.forEach( function( d ) { d.count = +d.count; });

        var margin = {top: 40, right: 20, bottom: 30, left: 40},
            width = 1100 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var x = d3.scaleBand().range( [ 0, width ] ).padding(0.1);
        var y = d3.scaleLinear().range( [ height, 0 ]);

        var prev = document.getElementById( "show-barc" );
        if( prev != null ) prev.remove();
        var svg = d3.select( "#bar" ).append( "svg" )
            .attr( "id", "show-barc" )
            .attr( "width", width + margin.left + margin.right )
            .attr( "height", height + margin.top + margin.bottom )
            .append( "g" )
            .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

        // svg.call( tip );

// d3.tsv("data.tsv", type, function(error, data) {

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
        document.getElementById( "x-label" ).innerHTML = x_name;

        // text label for the y axis
        svg.append( "text" )
            .attr( "transform", "rotate( -90 )" )
            .attr( "x", 0 - (height / 2) )
            .attr( "y", 0 - (margin.left) )
            .attr( "dy", "1em" )
            .style( "fill", "white" )
            .style( "font-weight", "bold" )
            // this makes it easy to center the text as the transform is applied to the anchor
            .style( "text-anchor", "middle" )
            .text( "Numbers" );

        // append the rectangles for the bar chart
        svg.selectAll( ".bar" )
            .data( data )
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function( d ) { return x( (parseInt(d.group - 10) + "-" + d.group) ); })
            .attr("width", x.bandwidth() )
            .attr("y", function( d ) { return y( d.count ); })
            .attr("height", function( d ) { return height - y( d.count ); });

        var ofst = (parseInt((parseInt(value) / 10)) + 1);
        if( (parseInt(value) % 10) == 0 ) ofst -= 1;
        var prev = document.getElementById( "show-hint" );
        if( prev != null ) prev.remove();
        var tooltip = d3.select( "body" ).append( "div" ).attr( "class", "tool-tip" );
        tooltip.attr( "id", "show-hint" )
            .style( "left", 31 + (x.bandwidth() / 2) + ofst * x.bandwidth() + "px" )
            .style( "top", $("#bar").position().top + "px" )
            .style( "opacity", 0.9 )
            .style( "transition", "0.5s" )
            .style( "visibility", "visible" )
            .html( "This Pokemon belongs here." );
    }
};

// function type( d )
// {
//     d.count = +d.count;
//     return d;
// }