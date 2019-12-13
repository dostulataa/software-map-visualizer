# software-map-visuzalizer

Visualizes layouting algorithms for hierarchical data

## Getting Started

Clone the git repository
```
git clone https://github.com/reitermaniacL/software-map-visualizer
```

At the projects diretory install the dependencies with
```
npm install
```

Build the project with
```
npm run build
```

Start the project with
```
npm start
```

Visualization can be viewed in the browser on
```
localhost:8080
```
When you click a node its name and attributes are displayed. A new treemap can then be loaded by clicking on the metric to be used.

In src/index.ts you can change the 'svg_width' and 'svg_height' to change the size of the visualization canvas.
