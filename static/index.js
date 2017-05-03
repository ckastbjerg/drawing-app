// based on http://bl.ocks.org/cloudshapes/5661984 by cloudshapes

var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var ptdata = [];
var session = [];
var path;
var drawing = false;

var output = d3.select('#output');

var line = d3.svg.line()
    .interpolate('bundle') // basis, see http://bl.ocks.org/mbostock/4342190
    .tension(1)
    .x(d => d.x)
    .y(d => d.y);

var svg = d3.select('#sketch').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

svg
  .on('mousedown', listen)
  .on('touchstart', listen)
  .on('touchend', ignore)
  .on('touchleave', ignore)
  .on('mouseup', ignore)
  .on('mouseleave', ignore);


// ignore default touch behavior
var touchEvents = ['touchstart', 'touchmove', 'touchend'];
touchEvents.forEach(eventName => {
  document.body.addEventListener(eventName, e => e.preventDefault());
});


function listen () {
  drawing = true;
  ptdata = []; // reset point data
  path = svg.append('path') // start a new line
    .data([ptdata])
    .attr('class', 'line')
    .attr('d', line);

  if (d3.event.type === 'mousedown') {
    svg.on('mousemove', onmove);
  } else {
    svg.on('touchmove', onmove);
  }
}

function ignore () {
  svg.on('mousemove', null);
  svg.on('touchmove', null);

  // skip out if we're not drawing
  if (!drawing) {
      return;
  }

  drawing = false;

  // simplify
  ptdata = simplify(ptdata);

  // add newly created line to the drawing session
  session.push(ptdata);

  // redraw the line after simplification
  tick();
}


function onmove (e) {
  var type = d3.event.type;
  var point;

  if (type === 'mousemove') {
    point = d3.mouse(this);
  } else {
    // only deal with a single touch input
    point = d3.touches(this)[0];
  }

  // push a new data point onto the back
  ptdata.push({
    x: point[0],
    y: point[1],
  });

  tick();
}

function tick() {
  path.attr('d', d => line(d)) // Redraw the path:
}

document.querySelectorAll('#send')[0].addEventListener('click', e => {
  const body = JSON.stringify({
    data: document.querySelectorAll('#sketch')[0].innerHTML,
  })

  fetch('svg', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  });
})