import validateInputFiles from "./Validation";
import Rectangle from "./models/treemap/Rectangle";
import TreemapNode from "./models/treemap/TreemapNode";
import Project from "./models/codeCharta/Project";
import codeCharta from "./input/codeCharta";
import { default as schema } from "./schema";
import { default as squarify } from "./algorithms/squarified";
import { select, event } from "d3-selection";

const inputFiles = [codeCharta];
validateInputFiles(schema, inputFiles); // Checks for input data validity with schema

const treemapWidth = 800;
const treemapHeight = 600;
const projects = inputFiles.map(input => Project.create(input)); // Create projects for input files
const metric = "rloc";

for(const project of projects) {
    createTreemap(project, squarify, new Rectangle([0, 0], [treemapWidth, treemapHeight]), metric, 1, false);
}

// createTreemapDropdown(algorithms);

/**
 * Creates the Treemap using d3 for drawing
 * @param project the project that should be visualized
 * @param algorithm the treemap algorithm to be used
 * @param canvas the canvas where a treemap is drawn on
 * @param metric the metric to determine a nodes size
 * @param leafMargin margin for leaf nodes to make underlying nodes visible
 * @param labels labels in treemap nodes ('true' only recommended for small projects)
 */
function createTreemap(project: Project, algorithm: Function, canvas: Rectangle, metric: string, leafMargin: number, labels: boolean) {
    let nodes: TreemapNode[] = algorithm(project.nodes, canvas, metric);

    const svg = select("body")
        .append("svg")
        .attr("x", 0)
        .attr("y", 200)
        .attr("width", canvas.width())
        .attr("height", canvas.height());

    const groups = svg.selectAll(".groups")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "treemapNode");

    groups.append('rect')
        .attr("x", (d: TreemapNode): number => { return d.rect.posX() + (isFile(d) ? leafMargin : 0) })
        .attr("y", (d: TreemapNode): number => { return d.rect.posY() + (isFile(d) ? leafMargin : 0) })
        .attr("height", (d: TreemapNode): number => { return d.rect.height() - (isFile(d) ? 2 * leafMargin : 0) })
        .attr("width", (d: TreemapNode): number => { return d.rect.width() - (isFile(d) ? 2 * leafMargin : 0) })
        .attr("fill", (d: TreemapNode): string => { return isFile(d) ? "LightSteelBlue" : "SteelBlue" })
        .on("mouseover", () => { select(event.currentTarget).style("fill", "lightgrey") })
        .on("mouseout", (d: TreemapNode) => { select(event.currentTarget).style("fill", (isFile(d) ? "LightSteelBlue" : "SteelBlue")) })
        .on("click", createAttributeList);

    if (labels) {
        groups.append('text')
            .text((d: TreemapNode): string => { return isFile(d) ? d.node.name : "" })
            .attr("x", (d: TreemapNode): number => { return d.rect.posX() + d.rect.width() / 2 })
            .attr("y", (d: TreemapNode): number => { return d.rect.posY() + d.rect.height() / 2 })
            .attr("text-anchor", "middle");
    }
}

// function createTreemapDropdown(algorithms: Function[]) {
//     const dropDown = select("body")
//         .append("select")
//         .attr("id", "selectBox");

//     const selectBox = document.getElementById("selectBox");
//     if (!selectBox) throw new Error("selectBox not found");
//     selectBox.onchange = (e: any) => {
//         const algName = e.target.options[e.target.selectedIndex].value
//         const treemap = algorithms.find(alg => { return alg.name === algName; });
//         if (treemap) {
//             console.log("ok");
//         } else {
//             throw new Error("function '" + algName + "' does not exist.");
//         }
//     }

//     dropDown.selectAll("options")
//         .data(algorithms)
//         .enter()
//         .append("option")
//         .text((d) => d.name)
//         .attr("value", (d) => d.name);
// }


/**
 * 
 * Creates the attribute table for a box
 * 
 * @param box box with parameters 
 */
function createAttributeList(treemapNode: TreemapNode) {

    let table = createTable();
    let header_row: HTMLElement = document.createElement("tr");
    let header_cell1: HTMLElement = document.createElement("th");
    let header_cell2: HTMLElement = document.createElement("th");

    table.appendChild(header_row);
    header_row.appendChild(header_cell1);
    header_row.appendChild(header_cell2);
    header_cell1.appendChild(document.createTextNode("name"));
    header_cell2.appendChild(document.createTextNode(treemapNode.node.name));

    treemapNode.node.attributes.forEach((paramValue: number, paramKey: string) => {
        let row: HTMLElement = document.createElement("tr");
        let cell1: HTMLElement = document.createElement("td");
        let cell2: HTMLElement = document.createElement("td");

        table.appendChild(row);
        row.appendChild(cell1);
        row.appendChild(cell2);
        cell1.appendChild(document.createTextNode(paramKey));
        cell2.appendChild(document.createTextNode(paramValue.toString()));
    });
}

/**
 * Creates a new HTML table for the attribute list
 */
function createTable(): HTMLElement {
    let body: HTMLElement = document.body;
    let attrList: HTMLElement | null = document.getElementById("attrList");
    /* remove attribute list if one is displayed already */
    if (attrList) {
        body.removeChild(attrList);
    }
    let table: HTMLElement = document.createElement("table");
    table.setAttribute("id", "attrList");
    table.style.cssText = 'float:right;';
    body.append(table);
    return table;
}

function isFile(treemapNode: TreemapNode): boolean {
    return treemapNode.node.type === "File";
}