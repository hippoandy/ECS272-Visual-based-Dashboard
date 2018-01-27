// Radar Chart
// Ref. https://bl.ocks.org/alandunning/4c36eb1abdb248de34c64f5672afd857

var radar_chart = {
    draw: function( id, d, options )
    {
        var conf = {
            radius: 5,
            w: 300,
            h: 300,
            factor: 1,
            factor_legend: .85,
            levels: 3,
            max_value: 0,
            radians: 2 * Math.PI,
            opacity_area: 0.5,
            to_right: 3,
            trans_x: 80,
            trans_y: 30,
            extra_width: 100,
            extra_height: 100,
            color: d3.scaleOrdinal().range( [ "#6F257F", "#CA0D59" ] )
        };

        // update the configurations
        if( 'undefined' !== typeof options )
            for( var i in options )
                if( 'undefined' !== typeof options[ i ] )
                    conf[ i ] = options[ i ];

        // get the attributes
        var all_axis = ( d[ 0 ].map( function( i, j ) { return i.attribute; } ) );
        // how many items
        var total = all_axis.length;
        // radis of the chart
        var radius = conf.factor * Math.min( (conf.w / 2), (conf.h / 2) );
        var Format = d3.format( '%' );
        d3.select( id ).select( "svg" ).remove();

        var g = d3.select( id )
            .append( "svg" )
            .attr( "width", (conf.w + conf.extra_width) )
            .attr( "height", (conf.h + conf.extra_height) )
            .append( "g")
            .attr( "transform", "translate( " + conf.trans_x + "," + conf.trans_y + " )" );

        // circular segments
        for( var j = 0 ; j < conf.levels ; j++ )
        {
            var level_factor = conf.factor * radius * ((j + 1) / conf.levels);
            g.selectAll( ".levels" )
            .data( all_axis )
            .enter()
            .append( "svg:line" )
            .attr( "x1", function( d, i ){ return level_factor * (1 - conf.factor * Math.sin( i * conf.radians / total )); } )
            .attr( "y1", function( d, i ){ return level_factor * (1 - conf.factor * Math.cos( i * conf.radians / total )); } )
            .attr( "x2", function( d, i ){ return level_factor * (1 - conf.factor * Math.sin( (i + 1) * conf.radians / total )); } )
            .attr( "y2", function( d, i ){ return level_factor * (1 - conf.factor * Math.cos( (i + 1) * conf.radians / total )); } )
            .attr( "class", "line" )
            .style( "stroke", "grey" )
            .style( "stroke-opacity", "0.75" )
            .style( "stroke-width", "0.3px" )
            .attr( "transform", "translate(" + (conf.w / 2 - level_factor) + ", " + (conf.h / 2 - level_factor) + ")" );
        }

        // text indicating at what % each level is
        for( var j = 0 ; j < conf.levels ; j++ )
        {
            var level_factor = conf.factor * radius * ((j + 1) / conf.levels);
            g.selectAll( ".levels" )
                .data( [1] ) //dummy data
                .enter()
                .append( "svg:text" )
                .attr( "x", function( d ) { return level_factor * (1 - conf.factor * Math.sin( 0 )); } )
                .attr( "y", function( d ) { return level_factor * (1 - conf.factor * Math.cos( 0 )); } )
                .attr( "class", "legend" )
                .style( "font-size", "10px" )
                .attr( "transform", "translate(" + (conf.w / 2 - level_factor + conf.to_right) + ", " + (conf.h / 2 - level_factor) + ")" )
                .attr( "fill", "#737373" )
                .text( (conf.max_value / conf.levels) * (j + 1) );
        }

        var axis = g.selectAll( ".axis" )
            .data( all_axis )
            .enter()
            .append( "g" )
            .attr( "class", "axis" );

        axis.append( "line" )
            .attr( "x1", (conf.w / 2) )
            .attr( "y1", (conf.h / 2) )
            .attr( "x2", function( d, i ) { return conf.w / 2 * (1 - conf.factor * Math.sin( i * conf.radians / total )); } )
            .attr( "y2", function( d, i ) { return conf.h / 2 * (1 - conf.factor * Math.cos( i * conf.radians / total )); } )
            .attr( "class", "line")
            .style( "stroke", "grey")
            .style( "stroke-width", "1px");

        axis.append( "text" )
            .attr( "class", "legend" )
            .text( function( d ) { return d; } )
            .style( "fill", "white" )
            .style( "font-size", "1.2em" )
            .style( "font-weight", "bold" )
            .attr( "text-anchor", "middle" )
            .attr( "dy", "1.5em" )
            .attr( "transform", function( d, i ) { return "translate( 0, -10 )"; } )
            .attr( "x", function( d, i ) { return conf.w / 2 * (1 - conf.factor_legend * Math.sin( i * conf.radians / total )) - 60 * Math.sin( i * conf.radians / total ); })
            .attr( "y", function( d, i ) { return conf.h / 2 * (1 - Math.cos( i * conf.radians / total )) - 20 * Math.cos( i * conf.radians / total ); } );

        var values = [];
        var series = 0;
        d.forEach( function( y, x )
        {
            g.selectAll( ".nodes" )
                .data( y, function( j, i )
                {
                    values.push([
                        conf.w / 2 * (1 - (parseFloat(Math.max( j.value, 0 )) / conf.max_value) * conf.factor * Math.sin( i * conf.radians / total )), 
                        conf.h / 2 * (1 - (parseFloat(Math.max( j.value, 0 )) / conf.max_value) * conf.factor * Math.cos( i * conf.radians / total ))
                    ]);
                }
            );

            values.push( values[ 0 ] );
            g.selectAll( ".attribute" )
                .data( [ values ] )
                .enter()
                .append( "polygon" )
                .attr( "class", "radar-chart-serie" + series )
                .style( "color", "white" )
                .style( "font-weight", "bold" )
                .style( "stroke-width", "2px")
                .style( "stroke", conf.color( series ) )
                .attr( "points", function( d )
                {
                    var str = "";
                    for( var i = 0 ; i < d.length ; i++ )
                        str = str + d[ i ][ 0 ] + "," + d[ i ][ 1 ] + " ";
                    return str;
                })
                .style( "fill", function( j, i ){ return conf.color( series ); } )
                .style( "fill-opacity", conf.opacity_area )
                .on( 'mouseover', function( d )
                {
                    var z = "polygon." + d3.select( this ).attr( "class" );
                    g.selectAll( "polygon" )
                        .transition( 200 )
                        .style( "fill-opacity", 0.1 );
                    g.selectAll( z )
                        .transition( 200 )
                        .style( "fill-opacity", 0.7 );
                })
                .on( 'mouseout', function()
                {
                    g.selectAll( "polygon" )
                    .transition( 200 )
                    .style( "fill-opacity", conf.opacity_area );
                });
            series++;
        });

        series = 0;
        var tooltip = d3.select( "body" ).append( "div" ).attr( "class", "tool-tip" );
        d.forEach( function( y, x )
        {
            g.selectAll( ".nodes" )
            .data( y ).enter()
            .append( "svg:circle" )
            .attr( "class", "radar-chart-serie" + series )
            .attr( 'r', conf.radius )
            .attr( "alt", function( j ) { return Math.max( j.value, 0 ); } )
            .attr( "cx", function( j, i )
            {
                values.push([
                    conf.w / 2 * (1 - (parseFloat(Math.max( j.value, 0 )) / conf.max_value) * conf.factor * Math.sin( i * conf.radians / total )), 
                    conf.h / 2 * (1 - (parseFloat(Math.max( j.value, 0 )) / conf.max_value) * conf.factor * Math.cos( i * conf.radians / total ))
                ]);
                return conf.w / 2 * (1 - (Math.max( j.value, 0 ) / conf.max_value) * conf.factor * Math.sin( i * conf.radians / total ));
            })
            .attr( "cy", function( j, i )
            {
                return conf.h / 2 * (1 - (Math.max( j.value, 0 ) / conf.max_value) * conf.factor * Math.cos( i * conf.radians / total ));
            })
            .attr( "data-id", function( j ) { return j.attribute; } )
            .style( "fill", "#fff" )
            .style( "stroke-width", "2px" )
            .style( "stroke", conf.color( series ) )
            .style( "fill-opacity", 0.9 )
            .on( 'mouseover', function( d )
            {
                tooltip.style( "left", d3.event.pageX - 70 + "px" )
                    .style( "top", d3.event.pageY - 75 + "px" )
                    .style( "opacity", 0.9 )
                    .style( "transition", "0.5s" )
                    .html( (d.attribute) + "<br><span>" + (d.value) + "</span>" );
                tooltip.style( "visibility", "visible" )
            })
            .on("mouseout", function( d ) { tooltip.style( "visibility", "hidden" ); })
            .on( 'click', function()
            {
                console.log( "hi!!" );
            });

            series++;
        });
    }
};