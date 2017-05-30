/*

This file is horrible, horrible mess.

*/



RESEARCH_DEPARTMENT = {
    'possible_science': [],
    'slots': [],
    'LOCATION_ORDERS': ['Surface: Landed', 'Surface: Splashed', 'Flying Low', 'Flying High', 'In Space Low', 'In Space High'],
    'INSTRUMENT_ORDERS':['Surface Sample', 'EVA Report', 'Crew Report', 'Mystery Goo Observation', 'Materials Study', 'Temperature Scan', 'Atmospheric Pressure Scan', 'Seismic Scan', 'Atmosphere Analysis','Infrared Telescope', 'Gravity Scan'],
    'SHORT_FORMS':{
        'In Space High':'InSpaceHigh',
        'In Space Low':'InSpaceLow',
        'Flying High':'FlyingHigh',
        'Flying Low':'FlyingLow',
        'Surface: Landed':'SrfLanded',
        'Surface: Splashed':'SrfSplashed',
        'Crew Report':'crewReport',
        'EVA Report':'evaReport',
        'Gravity Scan':'gravityScan',
        'Mystery Goo Observation':'mysteryGoo',
        'Seismic Scan':'seismicScan',
        'Surface Sample':'surfaceSample',
        'Materials Study':'mobileMaterialsLab',
        'Atmospheric Pressure Scan': 'barometerScan',
        'Temperature Scan':'temperatureScan',
        'Atmosphere Analysis': 'atmosphereAnalysis',
        'Infrared Telescope': 'infraredTelescope'
    }
}

function load_new_game_save(str){
    campaign_ksf = parse_sfs(str)
    sciences = extract_completed_science(campaign_ksf)
    sciences_by_id = _.chain(sciences).map(function(x){return [x.id, x]}).object().value()
    $(document).trigger("LOADED_NEW_STUFF")
}


sciences_by_id = {}
// $.get('testing_data/persistent.sfs', load_new_game_save) // Used to auto load a save file for testing
possible_science = []

$(function(){
    var dropplace = $('#planets').get(0)
    dropplace.ondrop = function(evt){
        evt.preventDefault()
        var file = evt.dataTransfer.files[0]
        var reader = new FileReader()
        reader.onload = function (event) {
            load_new_game_save(event.target.result)
        };
        reader.readAsText(file)
    }
    dropplace.ondragover = function(evt){evt.preventDefault()}
    dropplace.ondragend = function(evt){evt.preventDefault()}
})



function parse_all_science_csv(str){
    lines = str.split("\n")
    var out = []
    for(var i = 0; i < lines.length; i++){
        cols = lines[i].split(',')
        if(cols.length < 2){ continue; }
        sci = {'body':cols[0],'instrument':cols[2],'biome':cols[1], 'level':cols[3], 'location':cols[4], 'base': cols[5], 'max': cols[6]}
        sci.biome = sci.biome == "Universal" ? sci.body : sci.biome // Merge universale into planetary biome
        var short = RESEARCH_DEPARTMENT.SHORT_FORMS
        sci.id = short[sci.instrument]+"@"+sci.body+short[sci.location]+(sci.biome!=sci.body ? sci.biome.replace(/ /g,'') : '')
        out.push(sci)
    }
    return out
}

function get_all_possible_science_slots(sciences){
    var unique_slot_keys = {}
    var duplicated_slots = _.map(sciences, function(x){ return [x.location, x.instrument, x.level] })
    var slots = _.filter(duplicated_slots, function(x){ 
        var key = x.join("|")
        if(unique_slot_keys[key] == true){
            return false
        }else{
            unique_slot_keys[key] = true
            return true
        }
    })
    var INSTRUMENT_NUMBER = RESEARCH_DEPARTMENT.INSTRUMENT_ORDERS.length;
    return _.sortBy(slots, function(x){
        var ind1 = _.indexOf(RESEARCH_DEPARTMENT.LOCATION_ORDERS, x[0]);
        var ind2 = _.indexOf(RESEARCH_DEPARTMENT.INSTRUMENT_ORDERS,x[1]);
        return (ind1*INSTRUMENT_NUMBER+ind2);
    })
    
}

$.get('science/all_science.csv', function(str){
    RESEARCH_DEPARTMENT.possible_science = parse_all_science_csv(str)
    RESEARCH_DEPARTMENT.slots = get_all_possible_science_slots(RESEARCH_DEPARTMENT.possible_science)
    $(document).trigger("LOADED_NEW_STUFF")
})
