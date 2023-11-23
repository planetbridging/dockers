import React, { Component } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import axios from 'axios';

import { lst } from "./api";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.network = {};
    this.appRef = React.createRef();
  }

  componentDidMount() {
    //this.initializeGraph(lst);
    this.initializeGraph(null);
  }

  initializeGraph = async (data) => {


    if(data == null){
        try {
            
            const response = await axios.get('/api');
            console.log(response.data);
            data = response.data;
          } catch (error) {
            console.error('Error fetching data:', error);
            return;
          }
    }

    // Create an array of nodes with the unique table names and tooltips
    const nodes = new DataSet(
      [...new Set(data.map((item) => item.TABLE_NAME))].map((tableName) => ({
        id: tableName,
        label: tableName,
        title: `Table: ${tableName}`, // Tooltip text
      }))
    );

    // Create an array of edges based on foreign key relationships
    const edges = new DataSet();
    data.forEach((item) => {
      if (item.REFERENCED_TABLE_NAME) {
        edges.add({
          from: item.REFERENCED_TABLE_NAME,
          to: item.TABLE_NAME,
          arrows: "to",
          title: `Foreign key from ${item.REFERENCED_TABLE_NAME}.${item.REFERENCED_COLUMN_NAME} to ${item.TABLE_NAME}.${item.COLUMN_NAME}`, // Edge tooltip text
        });
      }
    });

    // Prepare the data for the graph
    const dataForGraph = {
      nodes,
      edges,
    };

    // Define the options for the graph
    const options = {
      autoResize: true,
      height: "1000px",
      width: "1000px",
      layout: {
        hierarchical: {
          enabled: true,
          levelSeparation: 200,
          nodeSpacing: 200,
          treeSpacing: 200,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
          direction: "UD",
          sortMethod: "directed",
        },
      },
      interaction: {
        tooltipDelay: 300,
        hover: true,
      },
      physics: {
        enabled: true,
        hierarchicalRepulsion: {
          centralGravity: 0.0,
          springLength: 200,
          springConstant: 0.01,
          nodeDistance: 200,
          damping: 0.09,
        },
        solver: "hierarchicalRepulsion",
      },
    };

    // Initialize the network
    this.network = new Network(this.appRef.current, dataForGraph, options);

    // Add event listener for selectNode event
    this.network.on("selectNode", (params) => {
      if (params.nodes.length === 1) {
        const nodeId = params.nodes[0];
        const nodeData = data.find((item) => item.TABLE_NAME === nodeId);
        this.showNodeDetails(nodeData);
      }
    });
  };

  showNodeDetails = (nodeData) => {
    if (nodeData) {
      // You can display the details in a console, but you might want to show it in the UI
      console.log("Selected node data:", nodeData);
      // Here you can update the state to show an info panel, modal, etc.
      // this.setState({ selectedNodeData: nodeData });
    }
  };

  initializeGraphddd = (data) => {
    const nodes = new DataSet(
      [...new Set(data.map((item) => item.TABLE_NAME))].map((tableName) => ({
        id: tableName,
        label: tableName,
      }))
    );

    const edges = new DataSet();

    data.forEach((item) => {
      if (item.REFERENCED_TABLE_NAME) {
        // Add an edge for each foreign key relationship
        edges.add({
          from: item.REFERENCED_TABLE_NAME,
          to: item.TABLE_NAME,
          arrows: "to",
        });
      }
    });

    const dataForGraph = {
      nodes,
      edges,
    };

    const optionssss = {
      autoResize: true,
      height: "1000px",
      width: "1000px",
      layout: {
        hierarchical: {
          enabled: true,
          levelSeparation: 150,
          nodeSpacing: 100,
          treeSpacing: 200,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
          direction: "UD", // UD for Up-Down, LR for Left-Right
          sortMethod: "directed", // hubsize, directed
        },
      },
      physics: {
        enabled: false, // Disabling physics for hierarchical layout
      },
    };

    const options = {
      autoResize: true,
      height: "1000px",
      width: "1000px",
      layout: {
        hierarchical: {
          enabled: true,
          levelSeparation: 200, // Increased separation
          nodeSpacing: 200, // Increased node spacing
          treeSpacing: 200, // Increased tree spacing
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
          direction: "UD", // UD for Up-Down, LR for Left-Right
          sortMethod: "directed", // hubsize, directed
        },
      },
      physics: {
        enabled: true, // Re-enable physics
        hierarchicalRepulsion: {
          centralGravity: 0.0,
          springLength: 200, // Adjust spring length as needed
          springConstant: 0.01,
          nodeDistance: 200, // Adjust node distance as needed
          damping: 0.09,
        },
        solver: "hierarchicalRepulsion",
      },
    };

    this.network = new Network(this.appRef.current, dataForGraph, options);
  };

  render() {
    return <div ref={this.appRef} style={{ width: "100%", height: "100%" }} />;
  }
}

export default Graph;
