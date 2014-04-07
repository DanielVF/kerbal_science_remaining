/*

This adds a single function, `extract_completed_science`, to the global namspace.

This takes one parameter, a parsed SFS file (which must be a game save sfs). 

It returns an array of science amounts from the game save.

[
    {
    cap: "1.5"
    dsc: "1"
    id: "crewReport@KerbinSrfLandedLaunchPad"
    sbv: "0.3"
    sci: "1.5"
    scv: "0"
    title: "Crew Report from LaunchPad"
    },
    ....
]

If given anything else, it may blow up.

*/


function extract_completed_science(many_ksf){
    
    // The following three functions are overly magical 
    // query langauge for selecting and extracting from a tree 
    // of [key, value/list] pairs.
    
    // Somewhere in the world, some one has already written something that does this.
    // It being three AM, after blowing rockets up all day, I can't find it.
    
    // Also due to the lateness of the hour, though these are doubtless common operations, I have
    // named them with one and two letter function names.
    
    // Let the reader therefor learn a lesson on the value of enough sleep, and recoil in horror at the depravity of code written at an untimely hour.
    
    // Begin Magic
    function f(many_ksf, selector_key){
        var out = []
        for(var i = 0; i < many_ksf.length; i++){
            if(many_ksf[i][0] == selector_key ){
                out.push(many_ksf[i])
            }
        }
        return out
    }
    
    function fk(many_ksf, selector_key, selector_value){
        var out = []
        for(var i = 0; i < many_ksf.length; i++){
            var ksf = many_ksf[i]
            for(var j = 0; j < ksf[1].length; j++){
                if(ksf[1][j][0]==selector_key && ksf[1][j][1] == selector_value){
                    out.push(ksf)
                    continue;
                }
            }
        }
        return out
    }
    
    function fo(many_ksf){
        var out = {}
        for(var i = 0; i < many_ksf.length; i++){
            out[many_ksf[i][0]] = many_ksf[i][1]
        }
        return out
    }
    // End Magic 
    
    // Use the Magic
    var scenarios = f(many_ksf[0][1],"SCENARIO") // Get each SCENARIO list
    var science_scenario = fk(scenarios,"name", "ResearchAndDevelopment")[0][1] // Find all the SCENARIO's with name = ResearchAndDevelopment
    var science = f(science_scenario,"Science") // Get each Science list
    
    all_sci = []
    for(var i = 0; i < science.length; i++){
        all_sci.push(fo(science[i][1])) // Convert sciences lists to science objects
    }
    
    return all_sci
}