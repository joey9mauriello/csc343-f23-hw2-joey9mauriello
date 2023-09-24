console.log(data);

var svg = d3.select("body").append("svg")
      .attr("viewBox", `0 0 960 500`)
      .attr("style", "max-width: 100%; height: auto;")

  height = 500;


var scalex = d3.scaleLinear()
            .domain(d3.extent(data, d =>d.max_temp))
            .range([50, 800]);


var scaley = d3.scaleLinear()
              .domain(d3.extent(data, d=>d.pressure))
              .range([50,450])


var scale_color = d3.scaleOrdinal()
                  .domain(d3.extent(data, d=>d.season))
                  .range(d3.schemeCategory10)


var data_circles = svg
  .selectAll(".dot")
  .data(data)
  .enter()
  .append("g")
  .attr("class", "dot")
  .on("mouseover", function(d){
    d3.select(this).select("circle").attr("r", 6)
    d3.select(this).select('text').attr("opacity",1)

  })
  .on("mouseout", function(d){
    d3.select(this).select('circle').attr("r", 1.5);
    d3.select(this).select('text').attr("opacity", 0);
  })


  data_circles.append('circle')
    .attr("cx", function(d) { return scalex(d.max_temp)})
    .attr("cy", function(d){return scaley(d.pressure)})
    .attr("r", 3)
    .style("fill", function(d){return scale_color(d.season)})
    // .on("mouseover", function(d){
    //   d3.select(this).attr("r", 10);
    // })
    // .on("mouseout", function(d){
    //   d3.select(this).attr("r",3)
    // });

  data_circles.append("text")
    .attr("x", d => scalex(d.max_temp))
    .attr("y", d => scaley(d.pressure))
    .attr("opacity", 1)
    .text(function(d) { return d.season})
    // .on("mouseover", function(d){
    //   d3.select(this).attr("opacity", 1);
    // })
    // .on("mouseout", function(d){
    //   d3.select(this).attr("opacity", 0);
    // })



var x_axis = d3.axisBottom()
      .scale(scalex);

var y_axis = d3.axisLeft()
      .scale(scaley);

svg.append("g")
    .attr('class','y-axis')
   .attr("transform", "translate(50, 0)")
   .call(y_axis);

svg.append("g")
    .attr('class','x-axis')
    .attr("transform", "translate(0, 450)")
    .call(x_axis)

svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 200)
    .attr("y", height - 6)
    .text("Max Temperature");

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 15)
    .attr("x", -300)
    .attr("transform", "rotate(-90)")
    .text("Pressure");