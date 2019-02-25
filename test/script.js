var width = document.getElementById('vis')
  .clientWidth;
var height = document.getElementById('vis')
  .clientHeight;

var margin = {
  top: 5,
  bottom: 100,
  left: 70,
  right: 20
};


var svg = d3.select('#vis')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom-50;

var data = {};

var x_scale = d3.scaleBand()
  .rangeRound([0, width])
  .padding(0.1);

var y_scale = d3.scaleLinear()
  .range([height, 0]);

var colour_scale = d3.scaleQuantile()
  .range(["#50232e","#ce5f2d","#f9b966","#fbe083","#a1cca5"]);
  //.range(["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]);

var y_axis = d3.axisLeft(y_scale);
var x_axis = d3.axisBottom(x_scale);

//new 2.19.... x axis
/*
svg.append("text")
  .attr("transform",
    "translate(" + (width/2) + " ," +
    (height + margin.top + 20) + ")")
  .style("text-anchor", "middle")
  .text("Teams");
*/
// text label for the y axis
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Yards");


svg.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + height + ')');

svg.append('g')
  .attr('class', 'y axis');


//x='rush';
function draw(year, x) {

  //x='rush';
  var csv_data = data[year];

  var t = d3.transition()
    .duration(2000);
  //new
  let div = d3.select("body").append("div").attr("class", "tooltip").attr("opacity", 0);
  //newend
  var teams = csv_data.map(function (d) {
    return d.Tm;
  });
  x_scale.domain(teams);
  if (x === 'pass') {
    var max_value = d3.max(csv_data, function (d) {
      return +d.pYds;
    });
  }
  if (x === 'rush') {
    var max_value = d3.max(csv_data, function (d) {
      return +d.rYds;
    });
  }
  if (x === 'total') {
    var max_value = d3.max(csv_data, function (d) {
      return +d.tYds;
    });
  }
  y_scale.domain([0, max_value]);
  colour_scale.domain([0, max_value]);


  var bars = svg.selectAll('.bar')
    .data(csv_data);

  bars
    .exit()
    .remove();

  var new_bars = bars
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('y', height)
    .attr('height', 0)

  //new

  bars = new_bars.merge(bars);


  bars
    .transition(t)
    .attr('y', function (d) {

      if (x === 'total') {
        return y_scale(+d.tYds);
      }
      if (x === 'pass') {
        return y_scale(+d.pYds);
      }
      if (x === 'rush') {
        return y_scale(+d.rYds);
      }
      //return y_scale(+d.tYds);
    }).attr('x', function (d) {
    return x_scale(d.Tm);
  })


    .attr('height', function (d) {
      if (x === 'total') {
        return height - y_scale(+d.tYds);
      }
      if (x === 'pass') {
        return height - y_scale(+d.pYds);
      }
      if (x === 'rush') {
        return height - y_scale(+d.rYds);
      }
      //return height - y_scale(+d.tYds)
    })
    .attr('width', x_scale.bandwidth())
    .attr('fill', function (d) {

      if (x === 'total') {
        return colour_scale(+d.tYds);
      }
      if (x === 'pass') {
        return colour_scale(+d.pYds);
      }
      if (x === 'rush') {
        return colour_scale(+d.rYds);
      }

      //return colour_scale(+d.tYds);
    })

  bars.on("mouseover", d => {
    //div.style('left', d3.event.pageX + "px").style("top", d3.event.pageY + "px");
    //div.transition().duration(1000).style("opacity", 1);
    if (x === 'total') {

      div.style('left', d3.event.pageX + "px").style("top", d3.event.pageY + "px");
      div.transition().duration(1000).style("opacity", 1);
      div.html(d.tYds);

    }
    if (x === 'pass') {
      div.style('left', d3.event.pageX + "px").style("top", d3.event.pageY + "px");
      div.transition().duration(1000).style("opacity", 1);
      div.html(d.pYds);
    }
    if (x === 'rush') {
      div.style('left', d3.event.pageX + "px").style("top", d3.event.pageY + "px");
      div.transition().duration(1000).style("opacity", 1);
      div.html(d.rYds); //these dont work
    }
    paused = true;
  })
    .on("mouseout", d => {
      div.transition().duration(1000).style("opacity", 0);
      paused = false;
    });
  //endnew
  svg.select('.x.axis')
    .transition(t)
    .call(x_axis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {
      return "rotate(-45)"
    });


  svg.select('.y.axis')
    .transition(t)
    .call(y_axis);

}


d3.queue()
  .defer(d3.csv, '1969.csv')
  .defer(d3.csv, '1970.csv')
  .defer(d3.csv, '1971.csv')
  .defer(d3.csv, '1972.csv')
  .defer(d3.csv, '1973.csv')
  .defer(d3.csv, '1974.csv')
  .defer(d3.csv, '1975.csv')
  .defer(d3.csv, '1976.csv')
  .defer(d3.csv, '1977.csv')
  .defer(d3.csv, '1978.csv')
  .defer(d3.csv, '1979.csv')
  .defer(d3.csv, '1980.csv')
  .defer(d3.csv, '1981.csv')
  .defer(d3.csv, '1982.csv')
  .defer(d3.csv, '1983.csv')
  .defer(d3.csv, '1984.csv')
  .defer(d3.csv, '1985.csv')
  .defer(d3.csv, '1986.csv')
  .defer(d3.csv, '1987.csv')
  .defer(d3.csv, '1988.csv')
  .defer(d3.csv, '1989.csv')
  .defer(d3.csv, '1990.csv')
  .defer(d3.csv, '1991.csv')
  .defer(d3.csv, '1992.csv')
  .defer(d3.csv, '1993.csv')
  .defer(d3.csv, '1994.csv')
  .defer(d3.csv, '1995.csv')
  .defer(d3.csv, '1996.csv')
  .defer(d3.csv, '1997.csv')
  .defer(d3.csv, '1998.csv')
  .defer(d3.csv, '1999.csv')
  .defer(d3.csv, '2000.csv')
  .defer(d3.csv, '2001.csv')
  .defer(d3.csv, '2002.csv')
  .defer(d3.csv, '2003.csv')
  .defer(d3.csv, '2004.csv')
  .defer(d3.csv, '2005.csv')
  .defer(d3.csv, '2006.csv')
  .defer(d3.csv, '2007.csv')
  .defer(d3.csv, '2008.csv')
  .defer(d3.csv, '2009.csv')
  .defer(d3.csv, '2010.csv')
  .defer(d3.csv, '2011.csv')
  .defer(d3.csv, '2012.csv')
  .defer(d3.csv, '2013.csv')
  .defer(d3.csv, '2014.csv')
  .defer(d3.csv, '2015.csv')
  .defer(d3.csv, '2016.csv')
  .defer(d3.csv, '2017.csv')
  .defer(d3.csv, '2018.csv')
  .await(function (error, d1969, d1970, d1971, d1972, d1973, d1974, d1975, d1976, d1977, d1978, d1979, d1980, d1981, d1982, d1983, d1984, d1985, d1986, d1987, d1988, d1989, d1990, d1991, d1992, d1993, d1994, d1995, d1996, d1997, d1998, d1999, d2000, d2001, d2002, d2003, d2004, d2005, d2006, d2007, d2008, d2009, d2010, d2011, d2012, d2013, d2014, d2015, d2016, d2017, d2018) {
    data['1969'] = d1969.splice(0, d1969.length - 2);
    data['1970'] = d1970.splice(0, d1970.length - 2);
    data['1971'] = d1971.splice(0, d1971.length - 2);
    data['1972'] = d1972.splice(0, d1972.length - 2);
    data['1973'] = d1973.splice(0, d1973.length - 2);
    data['1974'] = d1974.splice(0, d1974.length - 2);
    data['1975'] = d1975.splice(0, d1975.length - 2);
    data['1976'] = d1976.splice(0, d1976.length - 2);
    data['1977'] = d1977.splice(0, d1977.length - 2);
    data['1978'] = d1978.splice(0, d1978.length - 2);
    data['1979'] = d1979.splice(0, d1979.length - 2);
    data['1980'] = d1980.splice(0, d1980.length - 2);
    data['1981'] = d1981.splice(0, d1981.length - 2);
    data['1982'] = d1982.splice(0, d1982.length - 2);
    data['1983'] = d1983.splice(0, d1983.length - 2);
    data['1984'] = d1984.splice(0, d1984.length - 2);
    data['1985'] = d1985.splice(0, d1985.length - 2);
    data['1986'] = d1986.splice(0, d1986.length - 2);
    data['1987'] = d1987.splice(0, d1987.length - 2);
    data['1988'] = d1988.splice(0, d1988.length - 2);
    data['1989'] = d1989.splice(0, d1989.length - 2);
    data['1990'] = d1990.splice(0, d1990.length - 2);
    data['1991'] = d1991.splice(0, d1991.length - 2);
    data['1992'] = d1992.splice(0, d1992.length - 2);
    data['1993'] = d1993.splice(0, d1993.length - 2);
    data['1994'] = d1994.splice(0, d1994.length - 2);
    data['1995'] = d1995.splice(0, d1995.length - 2);
    data['1996'] = d1996.splice(0, d1996.length - 2);
    data['1997'] = d1997.splice(0, d1997.length - 2);
    data['1998'] = d1998.splice(0, d1998.length - 2);
    data['1999'] = d1999.splice(0, d1999.length - 2);
    data['2000'] = d2000.splice(0, d2000.length - 2);
    data['2001'] = d2001.splice(0, d2001.length - 2);
    data['2002'] = d2002.splice(0, d2002.length - 2);
    data['2003'] = d2003.splice(0, d2003.length - 2);
    data['2004'] = d2004.splice(0, d2004.length - 2);
    data['2005'] = d2005.splice(0, d2005.length - 2);
    data['2006'] = d2006.splice(0, d2006.length - 2);
    data['2007'] = d2007.splice(0, d2007.length - 2);
    data['2008'] = d2008.splice(0, d2008.length - 2);
    data['2009'] = d2009.splice(0, d2009.length - 2);
    data['2010'] = d2010.splice(0, d2010.length - 2);
    data['2011'] = d2011.splice(0, d2011.length - 2);
    data['2012'] = d2012.splice(0, d2012.length - 2);
    data['2013'] = d2013.splice(0, d2013.length - 2);
    data['2014'] = d2014.splice(0, d2014.length - 2);
    data['2015'] = d2015.splice(0, d2015.length - 2);
    data['2016'] = d2016.splice(0, d2016.length - 2);
    data['2017'] = d2017.splice(0, d2017.length - 2);
    data['2018'] = d2018.splice(0, d2018.length - 2);

    draw('2018', 'rush');


  });


var slider = d3.select('#year');

slider.on('change', function () {
  updateView();
});
function updateView(){
  var e = document.getElementById("type");
  var x = e.options[e.selectedIndex].text;
  var s = document.getElementById("year");
  var value = s.value;
  draw(value, x);
}

var typeSelection = d3.select('#type');

typeSelection.on('change', function () {
  updateView();
});


