$( document ).ready(function()
{

// Variable Declarations ----------------------------------------------------
var dataset = "./dataset/pokemon_alopez247.csv";
var sub_dataset_1 = "./dataset/types.csv";
var sub_dataset_2 = "./dataset/egggroups.csv";

var data = [];
var type_st = [];
var eg_st = [];

// --------------------------------------------------- Variable Declarations

var pokemons = document.getElementById( "pokemons" );
pokemons.innerHTML = "";

var numofpoke = 0;
var numofpage = 0;
var maxpokemon = 24;
var recentbreak = 0;
var page = 1;
var numpage = document.getElementById( "pagenum" );
// Reading Data ------------------------------------------------------------
// read the main dataset
var flag = 0;
d3.csv( dataset, function( d )
{
    data.push( d );

    var ndiv = document.createElement( "div" );
    ndiv.className = "item";
    if( flag == 0 )
    {
        ndiv.className += " bgcolor-grass";
        flag = 1;
    }
    else
    {
        ndiv.className += " bgcolor-grass-dark";
        flag = 0;
    }
    var img = document.createElement( "img" );
    img.setAttribute( "src", ("./img/pokemon/" + String(d.Number) + ".png") );
    img.setAttribute( "style", "padding: 2px;" );
    img.setAttribute( "width", "80px" );
    img.setAttribute( "height", "80px" );
    img.setAttribute( "alt", String(d.Name) );
    ndiv.innerHTML = d.Name;
    img.dataset.number = d.Number;
    ndiv.appendChild( img );
    ndiv.dataset.number = d.Number;
    ndiv.onclick = find_pokemon;
    pokemons.appendChild( ndiv );

    numofpoke += 1;
    // console.log( "Hi" + String(numofpoke / maxpokemon) );
    if( numofpoke % maxpokemon == 0 )
    {
        recentbreak = numofpoke;
        numofpage += 1;
        $("#pokemons > div").slice( (numofpoke - maxpokemon), numofpoke ).addClass( 'page' + String(numofpage) ).hide();
    }

}, function( error, header )
{
    if( error ) throw error;
    $('.page1').show();
    numpage.innerHTML = "1 / " + numofpage;

    if( numofpoke % maxpokemon != 0 )
    {
        numofpage += 1;
        $("#pokemons > div").slice( recentbreak, numofpoke ).addClass( 'page' + String(numofpage) ).hide();
    }

    $('.next').on('click', function()
    {
        if( page < numofpage )
        {
            $("#pokemons > div:visible").hide();
            $('.page' + ++page).show();
        }
        numpage.innerHTML = page + " / " + numofpage;
    });
    $('.prev').on('click', function() {
        if( page > 1 )
        {
            $("#pokemons > div:visible").hide();
            $('.page' + --page).show();
        }
        numpage.innerHTML = page + " / " + numofpage;
    });

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
}

// show the first tab
document.getElementById( "dashboard" ).style.display = "block";

function find_pokemon( event )
{
    var el = event.target;
    var num = parseInt(el.dataset.number);

    var config = {
        w: 300,
        h: 300,
        max_value: 250,
        levels: 5,
        extra_width: 300
    };
    var toradar = [
        [
            {"attribute": "Attack", "value": data[ (num - 1) ].Attack},
            {"attribute": "Defense", "value": data[ (num - 1) ].Defense},
            {"attribute": "Speed", "value": data[ (num - 1) ].Speed},
            {"attribute": "Speical Attack", "value": data[ (num - 1) ].Sp_Atk},
            {"attribute": "Speical Defense", "value": data[ (num - 1) ].Sp_Def}
        ]
    ];
    // draw the radar chart
    radar_chart.draw( "#radar", toradar, config );


    var ava = document.getElementById( "avatar" );
    ava.innerHTML = ""
    var img = document.createElement( "img" );
    img.setAttribute( "src", ("./img/pokemon/" + String(num) + ".png") );
    img.setAttribute( "style", "padding: 10px;" );
    img.setAttribute( "width", "180px" );
    img.setAttribute( "height", "180px" );
    ava.appendChild( img );

    var cir = document.getElementById( "det-cir" );
    cir.style.fill = data[ (num - 1) ].Color;

    var name = document.getElementById( "det-name" );
    name.innerHTML = data[ (num - 1) ].Name;

    var det = document.getElementById( "det" );
    var toput = "<table class='det-text' width='100%'><tr><td width='30%' align='center' sytle='margin-right: 20px;'>Type</td><td><type>"
    if( data[ (num - 1) ].Type_2 == "" )
        toput += data[ (num - 1) ].Type_1;
    else
        toput += data[ (num - 1) ].Type_1 + " / " + data[ (num - 1) ].Type_2;
    toput += "</type></td></tr><tr><td align='center'>Egg Group</td><td><type>";
    if( data[ (num - 1) ].Egg_Group_2 == "" )
        toput += data[ (num - 1) ].Egg_Group_1;
    else
        toput += data[ (num - 1) ].Egg_Group_1 + " / " + data[ (num - 1) ].Egg_Group_2;
    toput += "</type></td></tr></table>"
    det.innerHTML = toput;

    var hp = document.getElementById( "hp" );
    // hp.setAttribute( "width", String(data[ (num - 1) ].HP) + "px" );
    hp.setAttribute( "style", "width: " + String((parseInt(data[ (num - 1) ].HP) * 3)) + "px" );

    var hpnum = document.getElementById( "hp-num" );
    hpnum.innerHTML = data[ (num - 1) ].HP;
}

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