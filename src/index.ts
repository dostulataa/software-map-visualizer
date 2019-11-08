import * as d3 from "d3";

const nodes = [
    {
        name: "1",
        x: 0,
        y: 0,
        width: 250,
        height: 500,
    },
    {
        name: "1.1",
        x: 0,
        y: 0,
        width: 250,
        height: 250  
    },
    {
        name: "1.2",
        x: 0,
        y: 250,
        width: 250,
        height: 250,
    },
    {
        name: "1.2.1",
        x: 0,
        y: 250,
        width: 125,
        height: 250
    },
    {
        name: "1.2.2",
        x: 125,
        y: 250,
        width: 125,
        height: 250
    },
    {
        name: "2",
        x: 250,
        y: 0,
        width: 250,
        height: 500
    }
];    

console.log(nodes);

const svg = d3.select("body")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

const groups = svg.selectAll(".groups")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "gbar");     
    
groups.append('rect')
    .attr("width", function(d) { return d.width })
    .attr("height", function(d) { return d.height })
    .attr("x", function(d) { return d.x })
    .attr("y", function(d) { return d.y })
    .attr("fill", "white")
    .attr("stroke", "black");

groups.append('text')
    .text(function (d) { return d.name; })
    .attr("x", function(d) { return d.x + d.width / 2 })
    .attr("y", function(d) { return d.y + d.height / 2 })
    .attr("text-anchor", "middle");
