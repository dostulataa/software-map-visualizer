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

You can then chose the algorithm that is used for the visualization.

When you click on a node its name and attributes are displayed

To change the attribute by which the nodes are scaled you can change the global value 'attribute' in src/index.ts.
In this file you can also change the 'svg_width' and 'svg_height' to change the size of the visualization canvas.
In the import of the 'data' variable you can change the path to the file you wish to be used. 
Make sure it's a .ts file exporting a json object that matches src/schema.ts.
