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
When you click a node its name and attributes are displayed.

To change the attribute by which the nodes are scaled you can change the global value 'attribute' in src/index.ts.

In this file you can also change the 'svg_width' and 'svg_height' to change the size of the visualization canvas.
