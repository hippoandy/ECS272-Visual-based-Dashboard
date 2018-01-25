$( document ).ready(function()
{

// Variable Declarations ----------------------------------------------------
var dataset = "./dataset/pokemon_alopez247.csv";
var sub_dataset_1 = "./dataset/types.csv";
var sub_dataset_2 = "./dataset/egggroups.csv";

var data = [];

var type_st = [];
var eg_st = [];

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
// --------------------------------------------------- Variable Declarations

// Reading Data ------------------------------------------------------------
// read the main dataset
d3.csv( dataset, function( d )
{
    data.push( d );
}, function( error, header )
{
    if( error ) throw error;
    type_color();
});

function type_color()
{
    // read the pre-defined color for each type of Pokémon
    d3.csv( sub_dataset_1, function( d )
    {
        d.forEach( function( e ) {
            type_st.push( {"Type": String(e.Type), "Color": String(e.Color), "Amount": parseInt(e.Amount)} );
        });
        // eg_color();
        draw();
    });
}
function eg_color()
{
    // read the pre-defined color for each type of Pokémon
    d3.csv( sub_dataset_2, function( d )
    {
        d.forEach( function( e ) {
            eg_st.set( String(e.Egg_Group), {"Color": String(e.Color), "Amount": parseInt(e.Amount)} );
        });
        draw();
    });
}
// ------------------------------------------------------------ Reading Data

// start drawing the chart
function draw()
{
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
        list.innerHTML = "";
        for( var i = 0 ; i < data.length ; i++ )
        {
            if( data[ i ].Type_1 == d.data.Type )
            {
                var new_div = document.createElement( "div" );
                new_div.className = "item";
                new_div.innerHTML = data[ i ].Name;
                list.appendChild( new_div );
            }
        }
    });
    d3.select( self.frameElement ).style( "height", diameter + "px" );
}

// show the first tab
document.getElementById( "Home" ).style.display = "block";

});

function change_color( id )
{
    $(".nav>li").removeClass( "active" );
    $(id).addClass( "active" );
}

function open_tab(evt, tab_name)
{
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName( "tabcontent" );
    for( i = 0; i < tabcontent.length; i++ )
        tabcontent[i].style.display = "none";

    document.getElementById( tab_name ).style.display = "block";
}