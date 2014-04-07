/** @jsx React.DOM */
var PlanetBox = React.createClass({
    render: function(){
        var className = "planet "+this.props.name
        return (
            <div className={className}>
            <BodyBox name={this.props.name} />
            {this.props.children}
            </div>
        )
    }
})

var ScienceBox = React.createClass({
    render: function(){
        if(this.props.science == undefined){
            return (<a className="science nope" href="#"></a>)
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
            <a className={className} href="#" title={alt}>
            {remainingDsp}
            </a>
        )
    }
})

var BiomeBox = React.createClass({
    render: function(){
        var component = this
        var sciences =  _.map(RESEARCH_DEPARTMENT.slots, function(slot){
            var science = _.find(component.props.possibleSciences, function(s){
                return s.instrument == slot[1] && s.location == slot[0]
            })
            return (<ScienceBox science={science}/>)
        })
        
        return (
            <div className="biome">
            <div className="biomeHeader">{this.props.biomeName}</div>
            {sciences}
            </div>
        )
    }
})

var BodyBox = React.createClass({
    getInitialState: function() {
        return {biomes: []};
      },
    reload: function(){
        var component = this
        my_sci = _.filter(RESEARCH_DEPARTMENT.possible_science, function(x){return x.body == component.props.name})
        biomes = _.groupBy(my_sci, function(x){ return x.biome})
        component.setState({'biomes': biomes})
    },
    render: function() {
        var body = this.props.name
        var ordered_biomes = _.chain(this.state.biomes)
            .map(function(v, k){return[v,k]})
            .sortBy(function(x){return x[1]==body ? '0000' : x[1] }) // Body's main bio goes first
            .value()
        var biomes = _.map(ordered_biomes, function(x){
            var possibleSciences=x[0], biomeName=x[1]
            return (<BiomeBox biomeName={biomeName} possibleSciences={possibleSciences} />)
        })
        
        var body_width = _.keys(this.state.biomes).length * 72;
        var style = {width: body_width+"px"}
        
        return (
          <div className="body" style={style}>
            <div>
            {biomes}
            </div>
          </div>
        );
      },
    componentWillMount: function() {
        var component = this
        $(document).on('LOADED_NEW_STUFF', function(){
            component.reload()
        })
        component.reload()
    }
})


React.renderComponent(
  <div>
  <div className="group">
      <PlanetBox name="Sun"/>
      <PlanetBox name="Moho" />
      <PlanetBox name="Eve">
          <BodyBox name="Gilly" />
      </PlanetBox>

      <PlanetBox name="Duna">
          <BodyBox name="Ike" />
      </PlanetBox>
  </div>
  <div className="group">
      <PlanetBox name="Kerbin" >
          <BodyBox name="Mun" />
          <BodyBox name="Minmus" />
      </PlanetBox>
  </div>
  <div className="group">
      <PlanetBox name="Dres" />
      <PlanetBox name="Jool" >
          <BodyBox name="Laythe" />
          <BodyBox name="Vall" />
          <BodyBox name="Tylo" />
          <BodyBox name="Bop" />
          <BodyBox name="Pol" />
      </PlanetBox>
      <PlanetBox name="Eeloo" />
  </div>
  </div>
  ,
  document.getElementById('planets')
);


React.renderComponent(
  <div>
  <div className="group">
      <PlanetBox name="Sun"/>
      <PlanetBox name="Moho" />
      <PlanetBox name="Eve">
          <BodyBox name="Gilly" />
      </PlanetBox>

      <PlanetBox name="Duna">
          <BodyBox name="Ike" />
      </PlanetBox>
  </div>
  <div className="group">
      <PlanetBox name="Kerbin" >
          <BodyBox name="Mun" />
          <BodyBox name="Minmus" />
      </PlanetBox>
  </div>
  <div className="group">
      <PlanetBox name="Dres" />
      <PlanetBox name="Jool" >
          <BodyBox name="Laythe" />
          <BodyBox name="Vall" />
          <BodyBox name="Tylo" />
          <BodyBox name="Bop" />
          <BodyBox name="Pol" />
      </PlanetBox>
      <PlanetBox name="Eeloo" />
  </div>
  </div>
  ,
  document.getElementById('planets')
);