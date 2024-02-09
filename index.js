// import the GraphClass definiton from GraphClass.js
import GraphClass from './GraphClass.js'; 

/*
    Given some JSON data representing a graph, render it with D3
*/
// dummy commit
function renderGraph(graphData) {
    d3.selectAll(".link").remove();
    d3.selectAll(".node").remove();
    
    if (simulation) {
        simulation = null;
    }

    d3.select("svg").remove();

    var nodes = graphData["nodes"];
    var links = graphData["edges"];
    var width = window.innerWidth;
    var height = window.innerHeight;



    svg = d3.select("#graphviz")
        .append("svg")
        .attr('width', width-100)
        .attr('height', height-200);
    svg.append("rect")
        .attr("width", width - 100)
        .attr("height", height - 200)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "white");


    var graphGroup = svg.append("g");

    function zoomed(e) {
        graphGroup.attr("transform", e.transform);
    }
    
    var zoom = d3.zoom()
        .scaleExtent([0.1,5])
        .on("zoom", zoomed);
    svg.call(zoom)

    simulation = d3.forceSimulation()
        .nodes(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).links(links).distance(100))
        .force("charge", d3.forceManyBody().strength(0))
        .force("center", d3.forceCenter((width-100)/2,(height-200)/2))
        .force("collide", d3.forceCollide().radius(3))
        .force("gravity", d3.forceManyBody().strength(-0.001));

    var link = graphGroup.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("stroke-width", 0.4)
        .attr("stroke", "grey");


    var node = graphGroup.selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 3)
        .attr("fill", "blue")
        .on("click", clickNode);

    node.on("mouseover", function(d, i) {
        graphGroup
            .append("text")
            .text(i.id)
            .attr("x", i.x-5)
            .attr("y", i.y-8)
            .attr("font-size", "10px")
            .attr("fill", "blue")
            .style("display", "block");
        console.log(this);
    });

    node.on("mouseout", function(d, i) {
        graphGroup.selectAll("text")
            .style("display", "none");
    });



    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    

    var sourceNode = null
    function clickNode(event, d) {
        if (!sourceNode) {
            sourceNode = d;
            console.log(sourceNode.id);
        }
        else {
            var newLink = {source: sourceNode.id, target: d.id};
            simulation.stop();
            graphObj.addLink(newLink);
            renderGraph(graphObj.graph);
            sourceNode = null;
        }
    }

    

    simulation.on("tick", ticked);


}



/*
    Function to fetch the JSON data from output_graph.json & call the renderGraph() method
    to visualize this data
*/
function loadAndRenderGraph(fileName) {

    var graphData;
    fetch("./"+fileName).then((res) => {
        return res.json();
    })
    .then((data) => {graphObj.graph = data;
        graphData = renderGraph(graphObj.graph);
        displayGraphStatistics(graphObj);
        setUpExtras(graphObj);});

    
}

/*
    A method to compute simple statistics (Programming part Subproblem 6)
    on updated graph data
*/
function displayGraphStatistics(graphObj) {

    var button = document.querySelector("#computeStats");
    button.addEventListener("click", function() {
        var average = graphObj.computeAverageNodeDegree();
        document.querySelector("#avgDegree").innerText=average;
        var components = graphObj.computeConnectedComponents();
        document.querySelector("#numComponents").innerText = components;
        var density = graphObj.computeGraphDensity();
        document.querySelector("#graphDensity").innerText = density;
    })

}

function setUpExtras(graphObj) {
    var nodeButton = document.querySelector("#addNode");
    nodeButton.addEventListener("click", function() {
        var id = prompt("Enter new node id:\nNote: You may have to zoom out to see new node");
        if (id != null && id != "") {
            simulation.stop();
            graphObj.addNode(id);
            renderGraph(graphObj.graph);
        }
    });

    var edgeButton = document.querySelector("#addEdge");
    edgeButton.addEventListener("click", function() {
        alert("Click on a source node then a target node to add an edge");
    })
}



// instantiate an object of GraphClass
let graphObj = new GraphClass();

// your saved graph file from Homework 1
let fileName="output_graph.json";

let simulation;
let svg;
// render the graph in the browser
loadAndRenderGraph(fileName);

// compute and display simple statistics on the graph
//




