$(function (){

      // Graphの表示設定
      var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = 960 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      var svg = d3.select("#chart2").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      function viewChart1() {
          $("#chart1").show();
          $("#chart2").hide();
          $("#chart3").hide();
          console.log("#view1");
      }

      function drawLineChart() {

            var parseDate = d3.time.format("%d-%b-%y").parse;

            var x = d3.time.scale()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var color = d3.scale.category10();

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var line = d3.svg.line()
                .interpolate("basis")
                .x(function(d) {
                  return x(d.timestamp); 
                })
                .y(function(d) { return y(d.happy); });

            // Firebaseへのコネクション
            var Refs = new Firebase('https://y1dzhuuj.firebaseio.com/');

            // すでに存在するデータを取得する
            Refs.once('value', function(dataSnapShot){

              var value = dataSnapShot.val();

              for (astronaut_key in value.astronauts) {

                    var astronaut =  value.astronauts[astronaut_key];
                    var data = [];

                    // dataの形式はArrayにする必要がある
                    for (emotion_key in astronaut.history) {
                      data.push(astronaut.history[emotion_key]);
                    }

                    x.domain(d3.extent(data, function(d) { return d.timestamp; }));
                    // ハッピーを縦軸に
                    y.domain(d3.extent(data, function(d) { return d.happy; }));

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                      .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Price ($)");

                    svg.append("path")
                        .datum(data)
                        .attr("class", "line")
                        .attr("d", line);

                    return;
              } //for

          });//Refs.once

      }; //function

      viewChart1();

      //　データが追加されるたびにデータを表示する
      // Refs.on('child_added', function(dataSnapShot)) {
      //   var aaa = dataSnapShot.val();
      //   console.log(aaa);
      // };



  /* ---------------------
    UI
   --------------------- */

  var prev_view = "#view1";
  $("#menu_view li").click(
    function(){

      if (prev_view != this) {

          $(this).addClass("selected");
          $(prev_view).removeClass("selected");
          prev_view = this;

          switch ( this.id ) {
              case "view1":
                  viewChart1();
                  break;
              case "view2":
                  $("#chart1").hide();
                  $("#chart2").show();
                  $("#chart3").hide();
                  console.log("#view2");
                  drawLineChart();
                  break;
              case "view3":
                  $("#chart1").hide();   
                  $("#chart2").hide();
                  $("#chart3").show();
                  console.log("#view3");
                  break;
          }
      }
    }
  );

  var prev_iss = "#ISS1";
  $("#menu_iss li").click(
    function(){
      if (prev_view != this) {
          $(this).addClass("selected");
          $(prev_iss).removeClass("selected");
          prev_iss = this;
      }
    }
  );

  var prev_ppl = "#PPL1";
  $("#menu_ppl li").click(
    function(){
      if (prev_view != this) {
          $(this).addClass("selected");
          $(prev_ppl).removeClass("selected");
          prev_ppl = this;
    }
    }
  );



});