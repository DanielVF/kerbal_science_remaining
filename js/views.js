/** @jsx React.DOM */
var PlanetBox = React.createClass({displayName: 'PlanetBox',
    render: function(){
        var className = "planet "+this.props.name
        return (
            React.DOM.div( {className:className}, 
            BodyBox( {name:this.props.name} ),
            this.props.children
            )
        )
    }
})

var ScienceBox = React.createClass({displayName: 'ScienceBox',
    render: function(){
        if(this.props.science == undefined){
            return (React.DOM.a( {className:"science nope", href:"#"}))
        }
        var progress = sciences_by_id[this.props.science.id]
        var remaining = this.props.science.max;
        if(progress!=undefined){
            remaining = remaining - progress.sci
        }
        var factor = remaining / this.props.science.max
        var status="normal"
        if(factor < 0.1){
            status="completed"
        }else if(factor < 0.9){
            status="started"
        }

        var remainingDsp = Math.ceil(remaining)
        var alt = this.props.science.instrument + "  " + this.props.science.location
        var className = "science "+status
        return (
            React.DOM.a( {className:className, href:"#", title:alt}, 
            remainingDsp
            )
        )
    }
})

var BiomeBox = React.createClass({displayName: 'BiomeBox',
    render: function(){
        var component = this
        var sciences =  _.map(RESEARCH_DEPARTMENT.slots, function(slot){
            var science = _.find(component.props.possibleSciences, function(s){
                return s.instrument == slot[1] && s.location == slot[0]
            })
            return (ScienceBox( {science:science}))
        })
        
        return (
            React.DOM.div( {className:"biome"}, 
            React.DOM.div( {className:"biomeHeader"}, this.props.biomeName),
            sciences
            )
        )
    }
})

var BodyBox = React.createClass({displayName: 'BodyBox',
    getInitialState: function() {
        return {biomes: []};
      },
    render: function() {
        var body = this.props.name
        var ordered_biomes = _.chain(this.state.biomes)
            .map(function(v, k){return[v,k]})
            .sortBy(function(x){return x[1]==body ? '0000' : x[1] }) // Body's main bio goes first
            .value()
        var biomes = _.map(ordered_biomes, function(x){
            var possibleSciences=x[0], biomeName=x[1]
            return (BiomeBox( {biomeName:biomeName, possibleSciences:possibleSciences} ))
        })
        
        var body_width = _.keys(this.state.biomes).length * 72;
        var style = {width: body_width+"px"}
        
        return (
          React.DOM.div( {className:"body", style:style}, 
            React.DOM.div(null, 
            biomes
            )
          )
        );
      },
    componentWillMount: function() {
        var component = this
        $('body').on('LOADED_NEW_STUFF', function(){
            my_sci = _.filter(RESEARCH_DEPARTMENT.possible_science, function(x){return x.body == component.props.name})
            biomes = _.groupBy(my_sci, function(x){ return x.biome})
            component.setState({'biomes': biomes})
        })
    }
})


React.renderComponent(
  React.DOM.div(null, 
  React.DOM.div( {className:"group"}, 
      PlanetBox( {name:"Sun"}),
      PlanetBox( {name:"Moho"} ),
      PlanetBox( {name:"Eve"}, 
          BodyBox( {name:"Gilly"} )
      ),

      PlanetBox( {name:"Duna"}, 
          BodyBox( {name:"Ike"} )
      )
  ),
  React.DOM.div( {className:"group"}, 
      PlanetBox( {name:"Kerbin"} , 
          BodyBox( {name:"Mun"} ),
          BodyBox( {name:"Minmus"} )
      )
  ),
  React.DOM.div( {className:"group"}, 
      PlanetBox( {name:"Dres"} ),
      PlanetBox( {name:"Jool"} , 
          BodyBox( {name:"Laythe"} ),
          BodyBox( {name:"Vall"} ),
          BodyBox( {name:"Tylo"} ),
          BodyBox( {name:"Bop"} ),
          BodyBox( {name:"Pol"} )
      ),
      PlanetBox( {name:"Eeloo"} )
  )
  )
  ,
  document.getElementById('planets')
);


React.renderComponent(
  React.DOM.div(null, 
  React.DOM.div( {className:"group"}, 
      PlanetBox( {name:"Sun"}),
      PlanetBox( {name:"Moho"} ),
      PlanetBox( {name:"Eve"}, 
          BodyBox( {name:"Gilly"} )
      ),

      PlanetBox( {name:"Duna"}, 
          BodyBox( {name:"Ike"} )
      )
  ),
  React.DOM.div( {className:"group"}, 
      PlanetBox( {name:"Kerbin"} , 
          BodyBox( {name:"Mun"} ),
          BodyBox( {name:"Minmus"} )
      )
  ),
  React.DOM.div( {className:"group"}, 
      PlanetBox( {name:"Dres"} ),
      PlanetBox( {name:"Jool"} , 
          BodyBox( {name:"Laythe"} ),
          BodyBox( {name:"Vall"} ),
          BodyBox( {name:"Tylo"} ),
          BodyBox( {name:"Bop"} ),
          BodyBox( {name:"Pol"} )
      ),
      PlanetBox( {name:"Eeloo"} )
  )
  )
  ,
  document.getElementById('planets')
);