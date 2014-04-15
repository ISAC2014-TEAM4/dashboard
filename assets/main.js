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
          drawCircleChart();
      }

      function drawCircleChart() {
        /* ------------------
          initialise
        ------------------ */

        var circleChart1 = emotionalHealth.circlechart();
        var circleChart2 = emotionalHealth.circlechart();
        var circleChart3 = emotionalHealth.circlechart();
        var circleChart4 = emotionalHealth.circlechart();

        d3.select('#happy-chart').append('svg').attr('width', 960).attr('height', 200).call(circleChart1);
        d3.select('#surprised-chart').append('svg').attr('width', 960).attr('height', 200).call(circleChart2);
        d3.select('#sad-chart').append('svg').attr('width', 960).attr('height', 200).call(circleChart3);
        d3.select('#angry-chart').append('svg').attr('width', 960).attr('height', 200).call(circleChart4);


        /* ------------------
          load & draw data
        ------------------ */

        // Firebaseへのコネクション
        var Refs = new Firebase('https://y1dzhuuj.firebaseio.com/');

        var astronauts = {};
        var connections = {};

        function drawEmotions(data) {
          circleChart1.drawData( data, "happy", "#FFF01F" );
          circleChart2.drawData( data, "surprised", "#FFA63F"  );
          circleChart3.drawData( data, "sad", "#1FC2FF"  );
          circleChart4.drawData( data, "angry", "#FF7F96"  );
        }

        function update(astronaut_key) {

          var AstronautsQuery = Refs.child('astronauts/' + astronaut_key).limit(30);
          AstronautsQuery.once('value', function(_dataSnapShot){
            var value = _dataSnapShot.val();
            var data = [];

            // dataの形式はArrayにする必要がある
            for (emotion_key in value.history) {
              if (Date.now() - value.history[emotion_key].timestamp < 60 * 1000) {
                console.log(Date.now() - value.history[emotion_key].timestamp);
                data.push(value.history[emotion_key]);
              }
            }

            drawEmotions(data);

            // すでに存在するデータを取得する
            Refs.child('astronauts/' + astronaut_key + '/history').on('child_added', function(_dataSnapShot){
              var value = _dataSnapShot.val();
              data.push(value);

              drawEmotions(data);
            });
          });
        }

        function resetEmotions(){
          d3.select('#happy-chart').html("");
          d3.select('#surprised-chart').html("");
          d3.select('#sad-chart').html("");
          d3.select('#angry-chart').html("");
        }

        // いま、顔認識をしているユーザーを表示
        Refs.child('connections').on('value', function(_dataSnapShot){
          var connections = _dataSnapShot.val();
          console.log(connections);
          for (astronaut_key in connections) {
            $astronaut = $('<li/>', {
              text: astronaut_key
            });
            $('#astronaut-list').append($astronaut);
          }
        });

        $('#astronaut-list').on('click', function(e) {
          var astronaut_key = $(e.target).html();
          // resetEmotions();
          update(astronaut_key);
        });
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