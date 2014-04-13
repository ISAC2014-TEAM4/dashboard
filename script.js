var emotionalHealth = {};


emotionalHealth.circlechart = function module() {

  var svg, x, y;
  var dispatch = d3.dispatch('histReady');

  function exports(_selection) {
    svg = svg || _selection,
    svg.datum([]);
  };

  exports.drawData = function( _data, _emotion, _color) {
      var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = 960 - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom;

      var parseDate = d3.time.format("%d-%b-%y").parse;

      var xScale = d3.time.scale()
          .range([0+margin.left, width - margin.right]);

      var rScale = d3.scale.linear()
          .range([0, 60]);

      xScale.domain(d3.extent(_data, function(d) {
        return d.timestamp;
     }));

      if ( _emotion === "happy") {
          rScale.domain(d3.extent(_data, function(d) { return d.happy; }));
      } else if ( _emotion === "surprised") {
          rScale.domain(d3.extent(_data, function(d) { return d.surprised; }));
      } else if ( _emotion === "sad") {
          rScale.domain(d3.extent(_data, function(d) { return d.sad; }));
      } else if ( _emotion === "angry") {
          rScale.domain(d3.extent(_data, function(d) { return d.angry; }));
      }

      var circles = svg.selectAll(".dot").data( _data );

      circles.enter()
          .append("circle")
          .attr("class", "dot")
          .attr("r", function(d) {
            if ( _emotion === "happy") {
              return rScale(d.happy);
            } else if ( _emotion === "surprised") {
              return rScale(d.surprised);
            } else if ( _emotion === "sad") {
              return rScale(d.sad);
            } else if ( _emotion === "angry") {
              return rScale(d.angry);
            };
          })
          .attr("cx", function(d) { 
            return xScale(d.timestamp)
          })
          .attr("cy", 100 )
          .style("fill", _color)
          .style("fill-opacity", 0.05 );  

      circles.transition()
        .duration(500)
        .attr("class", "dot")
          .attr("r", function(d) {
            if ( _emotion === "happy") {
              return rScale(d.happy);
            } else if ( _emotion === "surprised") {
              return rScale(d.surprised);
            } else if ( _emotion === "sad") {
              return rScale(d.sad);
            } else if ( _emotion === "angry") {
              return rScale(d.angry);
            };
          })
          .attr("cx", function(d) {
            return xScale(d.timestamp)
          })
          .attr("cy", 100 )
          .style("fill", _color)
          .style("fill-opacity", 0.05 );  

      circles.exit()
        .transition()
        .duration(500)
        .remove();

      // svg.selectAll(".dot")
      //     .data(_data)
      //   .enter().append("circle")
      //     .attr("class", "dot")
      //     .attr("r", function(d) {
      //       if ( _emotion == "happy") {
      //         console.log(_emotion);
      //         return rScale(d.happy);
      //       } else if ( _emotion == "surprised") {
      //         console.log(_emotion);
      //         return rScale(d.surprised);
      //       } else if ( _emotion == "sad") {
      //         return rScale(d.sad);
      //       } else if ( _emotion == "angry") {
      //         return rScale(d.angry);
      //       };
      //     })
      //     .attr("cx", function(d) { 
      //       return xScale(d.timestamp)
      //     })
      //     .attr("cy", 100 )
      //     .style("fill", _color)
      //     .style("fill-opacity", 0.05 );  
  }

  dispatch.histReady();
  d3.rebind(exports, dispatch, 'on');
  
  return exports;
};

