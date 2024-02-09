export default class GraphClass {
    constructor() {
      this.graph = {
        nodes: [],
        edges: [],
        nodeDegrees: {}
      };
    }

    setGraph(data) {
      this.graph.nodes = data["nodes"];
      this.graph.edges = data["edges"];
      this.graph.nodeDegrees = data["nodeDegrees"];
    }

    


    // Problem 6a) Compute average node degree
    computeAverageNodeDegree() {
      var sum = 0;
      for (var key in this.graph.nodeDegrees) {
        sum += this.graph.nodeDegrees[key];
      }
      return sum/Object.entries(this.graph.nodeDegrees).length;
    }

    // Problem 6b) Number of connected components
    computeConnectedComponents() {
      function DFS(id, visited, edges) {
        visited[id] = true;
        for (var i = 0; i < edges.length; i++) {
          var connection = edges[i];
          
          if (connection["source"] == id) {
            
            if (visited[connection["target"]] == false) {
              DFS(connection["target"], visited, edges);
            }
          }
          
        }
  
      
  
      }

      var visited = {};

      for (var node in this.graph.nodes) {
        visited[this.graph.nodes[node].id] = false;
      }

      var count = 0;
      for (var node in this.graph.nodes) {
        if (visited[this.graph.nodes[node].id] == false) {
          DFS(this.graph.nodes[node].id, visited, this.graph.edges);
          
          count += 1;
        }

      }
      return count
    }

    

    // Problem 6c) Compute graph density
    computeGraphDensity() {
      var v = this.graph.nodes.length;
      var e = this.graph.edges.length;
      return (2*e)/(v*(v-1));
    }

    addNode(nodeId) {
      this.graph["nodes"].push({nodeId});
      this.graph["nodeDegrees"][nodeId] = 0;
    }

    addLink(link) {

      if (link["source"] == link["target"]) {
        alert("Invalid self loop!");
        return;
      }
      for (var edge in this.graph.edges) {
        if (edge["source"] == link["source"] && edge["target"] == link["target"]) {
          alert("Invalid edge. Already exists");
          return;
        }
        else if (edge["source"] == link["target"] && edge["target"] == link["source"]) {
          alert("Invalid edge. Already exists");
          return;
        }
      }
      this.graph["edges"].push(link);
    }
    
}
