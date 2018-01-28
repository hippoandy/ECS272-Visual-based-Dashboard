var pokemonset;

var attack;
var defense;
var speed;
var sp_atk;
var sp_def;

$( document ).ready(function()
{
    // Variable Declarations ----------------------------------------------------
    var dataset = "./dataset/pokemon_alopez247.csv";
    var sub_dataset_1 = "./dataset/types.csv";
    var sub_dataset_2 = "./dataset/egggroups.csv";

    pokemonset = [];
    var type_st = [];
    var eg_st = [];

    // to create the mulit-page list
    var numofpoke = 0;
    var numofpage = 0;
    var maxpokemon = 24;
    var recentbreak = 0;
    var page = 1;
    var numpage = document.getElementById( "pagenum" );

    attack = new Map();
    defense = new Map();
    speed = new Map();
    sp_atk = new Map();
    sp_def = new Map();
    // --------------------------------------------------- Variable Declarations

    var pokemons = document.getElementById( "pokemons" );
    pokemons.innerHTML = "";

    // Reading Data ------------------------------------------------------------
    // read the main dataset
    var flag = 0;
    d3.csv( dataset, function( d )
    {
        pokemonset.push( d );

        var atk = parseInt(d.Attack);
        if( atk % 10 == 0 )
            build_map( attack, String(parseInt(atk / 10) * 10), d.Number );
        else
            build_map( attack, String((parseInt(atk / 10) + 1) * 10), d.Number );
        
        var def = parseInt(d.Defense);
        if( def % 10 == 0 )
            build_map( defense, String(parseInt(def / 10) * 10), d.Number );
        else
            build_map( defense, String((parseInt(def / 10) + 1) * 10), d.Number );
        
        var spd = parseInt(d.Speed);
        if( spd % 10 == 0 )
            build_map( speed, String(parseInt(spd / 10) * 10), d.Number );
        else
            build_map( speed, String((parseInt(spd / 10) + 1) * 10), d.Number );

        var spa = parseInt(d.Sp_Atk);
        if( spa % 10 == 0 )
            build_map( sp_atk, String(parseInt(spa / 10) * 10), d.Number );
        else
            build_map( sp_atk, String((parseInt(spa / 10) + 1) * 10), d.Number );
        
        var spf = parseInt(d.Sp_Def);
        if( spf % 10 == 0 )
            build_map( sp_def, String(parseInt(spf / 10) * 10), d.Number );
        else
            build_map( sp_def, String((parseInt(spf / 10) + 1) * 10), d.Number );

        var a_class = " db-item";
        if( flag == 0 )
        {
            a_class += " bgcolor-grass";
            flag = 1;
        }
        else
        {
            a_class += " bgcolor-grass-dark";
            flag = 0;
        }
        pokemons.appendChild( create_pokeitem( d, a_class, find_pokemon ) );

        // multi-page list
        numofpoke += 1;
        if( numofpoke % maxpokemon == 0 )
        {
            recentbreak = numofpoke;
            numofpage += 1;
            $("#pokemons > div").slice( (numofpoke - maxpokemon), numofpoke ).addClass( 'page' + String(numofpage) ).hide();
        }

    },
    function( error, header )
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
            // draw the bubble chart
            bubble_chart( pokemonset, type_st );
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
            bubble_chart( pokemonset, eg_st );
        });
    }
    // ------------------------------------------------------------ Reading Data

    // show the first tab
    document.getElementById( "dashboard" ).style.display = "block";
});

// Function for Processing Data -------------------------------------------------------
function build_map( map, key, value )
{
    value = parseInt(value);
    if( map.has( key ) == false )
    {
        map.set( key, new Map() );
        map.get( key ).set( "count", 1 );
        map.get( key ).set( "nums", [ value ] );
    }
    else
    {
        map.get( key ).set( "count", map.get( key ).get( "count" ) + 1 );
        var nums = map.get( key ).get( "nums" );
        nums.push( value );
        map.get( key ).set( "nums", nums );
    }
}
// ------------------------------------------------------- Function for Processing Data

// Dashboard Onclick ------------------------------------------------------------------
function find_pokemon( event )
{
    $("#detail").animate({ scrollTop: 0 }, "slow");

    // show the detail
    document.getElementById( 'detail' ).style.display = 'block';

    var el = event.target;
    var num = parseInt(el.dataset.number);

    var config = {
        w: 250,
        h: 250,
        max_value: 250,
        levels: 5,
        extra_width: 200
    };
    var toradar = [[
        {"attribute": "Attack", "value": pokemonset[ (num - 1) ].Attack},
        {"attribute": "Defense", "value": pokemonset[ (num - 1) ].Defense},
        {"attribute": "Speed", "value": pokemonset[ (num - 1) ].Speed},
        {"attribute": "Speical Attack", "value": pokemonset[ (num - 1) ].Sp_Atk},
        {"attribute": "Speical Defense", "value": pokemonset[ (num - 1) ].Sp_Def}
    ]];
    // draw the radar chart
    radar_chart.draw( "#radar", toradar, config );
    // create the avatar for the detail canvas
    var ava = document.getElementById( "avatar" );
    ava.innerHTML = ""
    ava.appendChild( create_img( String(num), pokemonset[ (num - 1) ].Name, 180, 180, 10 ) );
    // show the group color
    var cir = document.getElementById( "det-cir" );
    cir.style.fill = pokemonset[ (num - 1) ].Color;
    // show the pokemon's name on the detail canvas
    var name = document.getElementById( "det-name" );
    name.innerHTML = "# " + pokemonset[ (num - 1) ].Number + " " + pokemonset[ (num - 1) ].Name;
    // create the detail info. table
    var det = document.getElementById( "det" );
    // adding type information
    var toput = "<table class='det-text' width='100%'><tr><td width='18%' align='left' sytle='margin-right: 20px;'>Type</td><td><type><italic>"
    if( pokemonset[ (num - 1) ].Type_2 == "" )
        toput += pokemonset[ (num - 1) ].Type_1;
    else
        toput += pokemonset[ (num - 1) ].Type_1 + "</italic></type> / <type><italic>" + pokemonset[ (num - 1) ].Type_2;
    // adding egg group information
    toput += "</italic></type></td></tr><tr><td align='left'>Egg Group</td><td><type><italic>";
    if( pokemonset[ (num - 1) ].Egg_Group_2 == "" )
        toput += String(pokemonset[ (num - 1) ].Egg_Group_1).replace( '_', ' ' );
    else
        toput += String(pokemonset[ (num - 1) ].Egg_Group_1).replace( '_', ' ' ) + "</italic></type> / <type><italic>" + String(pokemonset[ (num - 1) ].Egg_Group_2).replace( '_', ' ' );
    // adding generation information
    toput += "</italic></type></td></tr><tr><td>Generation</td><td><type><italic>" + pokemonset[ (num - 1) ].Generation + "</italic></type></td></tr>";
    toput += "</table>";
    det.innerHTML = toput;
    
    var attrlist = document.getElementById( "attr-list" );
    toput = "";
    // adding height information
    toput = toput + "<div class='attr-item'><h4>Height</h4><large>" + pokemonset[ (num - 1) ].Height_m + " </large><bold><italic>M</italic></bold></div>";
    // adding weight information
    toput = toput + "<div class='attr-item'><h4>Weight</h4><large>" + pokemonset[ (num - 1) ].Weight_kg + " </large><bold><italic>Kg</italic></bold></div>";
    // adding gender information
    toput += "<div class='attr-item'><h4>Gender</h4>";

    if( String(pokemonset[ (num - 1) ].hasGender) == "True" )
    {
        var male = parseFloat(pokemonset[ (num - 1) ].Pr_Male) * 100;
        toput = toput + "<large>" + String(male) + " </large><i class='fa fa-percent' aria-hidden='true'></i><large> <i class='fa fa-male margin-bottom' aria-hidden='true'></i></large><br>";
        toput = toput + "<large>" + String(100 - male) + " </large><i class='fa fa-percent' aria-hidden='true'></i><large> <i class='fa fa-female' aria-hidden='true'></i></large>";
        toput += "</div>";
    }
    else
        toput += "<large><i class='fa fa-question' aria-hidden='true'></i></large></div>";
    // // adding generation information
    // toput = toput + "<div class='attr-item'><h4>Generation</h4><large>" + pokemonset[ (num - 1) ].Generation + "</large></div>";
    // adding legendary information
    toput += "<div class='attr-item'><h4>Legendary</h4>";
    if( String(pokemonset[ (num - 1) ].isLegendary) == "True" )
        toput += "<large><i class='fa fa-check' aria-hidden='true'></i></large></div>";
    else
        toput += "<large><i class='fa fa-times' aria-hidden='true'></i></large></div>";
    // adding mega evolution information
    toput += "<div class='attr-item'><h4>Mega Evolution</h4>";
    if( String(pokemonset[ (num - 1) ].hasMegaEvolution) == "True" )
        toput += "<large><i class='fa fa-check' aria-hidden='true'></i></large></div>";
    else
        toput += "<large><i class='fa fa-times' aria-hidden='true'></i></large></div>";
    // adding catch rate information
    toput = toput + "<div class='attr-item'><h4>Catch Rate</h4><large>" + pokemonset[ (num - 1) ].Catch_Rate + " </large><i class='fa fa-percent' aria-hidden='true'></i></div>";
    attrlist.innerHTML = toput;

    var hp = document.getElementById( "hp" );
    hp.setAttribute( "style", "width: " + String((parseInt(pokemonset[ (num - 1) ].HP) * 3)) + "px" );

    var hpnum = document.getElementById( "hp-num" );
    hpnum.innerHTML = pokemonset[ (num - 1) ].HP;

    // auto-scroll
    auto_scroll( "#detail" );
}
// ------------------------------------------------------------------ Dashboard Onclick

// Dashboard Control Functions --------------------------------------------------------
function close_detail( id )
{
    // close the detail
    var ele = document.getElementById( id );
    if( ele != null )
        ele.style.display = 'none';

    switch( id )
    {
        case "detail":
            auto_scroll( "#dashboard" );
            break;
        case "bar":
            document.getElementById( "show-hint" ).style.display = "none";
            document.getElementById( "show-hint" ).style.top = 0;

            document.getElementById( "bar-list" ).style.display = "none";
            document.getElementById( "bar-list" ).style.top = 0;

            document.getElementById( "bar-list-show" ).style.display = "none";
            document.getElementById( "bar-list-show" ).style.top = 0;

            auto_scroll( "#detail" );
            break;
        case "bar-list":
            document.getElementById( "bar-list" ).style.top = 0;
            document.getElementById( "bar-list-show" ).style.top = 0;
            break;
    }
}
// -------------------------------------------------------- Dashboard Control Functions

// Navbar Functions -------------------------------------------------------------------
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
// ------------------------------------------------------------------- Navbar Functions

// General Usage ----------------------------------------------------------------------
// create the pokemon item
function create_pokeitem( d, additional_class, onclick )
{
    var ndiv = document.createElement( "div" );
    ndiv.className = "item";

    if( additional_class != "" )
        ndiv.className += additional_class;

    var img = create_img( d.Number, d.Name, 90, 90, 2 );
    ndiv.dataset.number = img.dataset.number = d.Number;
    ndiv.innerHTML = d.Number + ". " + d.Name;
    ndiv.appendChild( img );
    ndiv.onclick = onclick;
    
    return ndiv;
}
// create avatar
function create_img( number, name, width, height, padding )
{
    var img = document.createElement( "img" );
    img.setAttribute( "src", ("./img/pokemon/" + String(number) + ".png") );
    img.setAttribute( "style", "padding: " + padding + "px;" );
    img.setAttribute( "width", width + "px" );
    img.setAttribute( "height", height + "px" );
    img.setAttribute( "alt", String(name) );
    
    return img;
}

function auto_scroll( id )
{
    // auto-scroll
    $('html, body').animate(
    {
        scrollTop: $(id).offset().top
    },
    500);
}
// ---------------------------------------------------------------------- General Usage