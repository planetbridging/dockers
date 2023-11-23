import React, { Component } from 'react';
import axios from 'axios';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';

cytoscape.use(cola);

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = { schemaData: null };
    }

    componentDidMount() {
        this.fetchSchemaData();
    }

    fetchSchemaData = () => {
        axios.get('http://localhost:9090/api/schema')
            .then(response => {
                this.setState({ schemaData: response.data });
            })
            .catch(error => console.error('Error fetching schema data:', error));
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.schemaData !== prevState.schemaData) {
            this.initializeGraph();
        }
    }

    initializeGraph = () => {
        const { schemaData } = this.state;
        if (schemaData) {
            const cy = cytoscape({
                container: document.getElementById('cy'),
                elements: schemaData,
                layout: { name: 'cola' },
                // Additional Cytoscape configuration...
            });

            // Add event listeners for interaction...
        }
    }

    render() {
        return <div id="cy" style={{ width: '800px', height: '600px' }} />;
    }
}

export default Graph;
