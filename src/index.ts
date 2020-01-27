import validateInputFiles from "./Validation";
import Rectangle from "./models/visualization/Rectangle";
import VisualNode from "./models/visualization/VisualNode";
import CCProject from "./models/codeCharta/CCProject";
import junit2018 from "./input/codecharta_2020-01-23_08-15.cc";
import junit2019 from "./input/junit5_2019-10-26.cc";
import schema from "./schema";
import { select, event } from "d3-selection";
import squarify from "./algorithms/squarified";
import Point from "./models/visualization/Point";
import streetMap from "./algorithms/streetMap";
// import strip from "./algorithms/strip";

const inputFiles = [junit2018, junit2019];
validateInputFiles(schema, inputFiles); // Checks for input data validity with schema

let svgWidth = 400;
let svgHeight = 400;
const projects = inputFiles.map(input => CCProject.create(input)); // Create projects for input files
const metric = "rloc";

// createVisualization(projects[0], strip, metric, 1, "oldVersion");
createVisualization(projects[0], streetMap, metric, 0.5, "oldVersion");


/**
 * Creates the Treemap using d3 for drawing
 * @param project the project that should be visualized
 * @param algorithm the treemap algorithm to be used
 * @param metric the metric to determine a nodes size
 * @param leafMargin margin for leaf nodes to make underlying nodes visible
 * @param versionId id of the version column
 */
function createVisualization(project: CCProject, algorithm: Function, metric: string, leafMargin: number, versionId: string) {
    let nodes: VisualNode[] = [];
    if(algorithm === streetMap) {
        // REVIEW: wenn man statt Function einen Objekt-Typ verwendet,
        // könnte der Zugriff z.B. der Aufruf von draw() hier typsicher erfolgen.
        const rootStreet = algorithm(project.nodes[0], metric);
        svgWidth = rootStreet.width;
        svgHeight = rootStreet.height
        nodes = rootStreet.layout(new Point(0, 0));
    } else {
        nodes = algorithm(project.nodes[0], new Rectangle(new Point(0, 0), svgWidth, svgHeight), metric);
    }

    const codeVersion = select(`#${versionId}`);

    codeVersion.select(".title").text(project.projectName);

    const svg = codeVersion.select(".visualization")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    svg.selectAll("rect")
        .data(nodes)
        .enter()
        .append('rect')
        .attr("class", "treemapNode")
        .attr("id", (d: VisualNode): string => { return versionId + "-" + d.node.name.replace(".", "-") })
        .attr("x", (d: VisualNode): number => { return d.rectangle.topLeft.x + (isFile(d) ? leafMargin : 0) })
        .attr("y", (d: VisualNode): number => { return d.rectangle.topLeft.y + (isFile(d) ? leafMargin : 0) })
        .attr("height", (d: VisualNode): number => { return d.rectangle.height - (isFile(d) && d.rectangle.height > 2 * leafMargin ? 2 * leafMargin : 0) })
        .attr("width", (d: VisualNode): number => { return d.rectangle.width - (isFile(d) && d.rectangle.width > 2 * leafMargin ? 2 * leafMargin : 0) })
        .style("fill", (d: VisualNode): string => { return d.color })
        .on("mouseover", handleMouseover)
        .on("mouseout", handleMouseout)
        .on("click", createAttributeList);
}

/**
 * Handles mouse going inside of a treemap node. Changes color to highlighting color.
 * 
 * @param treemapNode treemap node which event is registered on 
 */
function handleMouseover(treemapNode: VisualNode) {
    let color = "lightgrey";
    select(event.currentTarget).style("fill", color);
    const codeVersion = select(event.currentTarget.closest(".codeVersion"));
    const codeVersionId = codeVersion.attr("id");
    colorizeOtherNode(codeVersionId, treemapNode.node.name.replace(".", "-"), color); // dot notation would imply a class
}

/**
 * Handles mouse going out of a treemap node. Reverts color back to original color.
 * 
 * @param treemapNode treemap node which event is registered on 
 */
function handleMouseout(treemapNode: VisualNode) {
    let color = treemapNode.color;
    select(event.currentTarget).style("fill", color);
    const codeVersion = select(event.currentTarget.closest(".codeVersion"));
    const codeVersionId = codeVersion.attr("id");
    colorizeOtherNode(codeVersionId, treemapNode.node.name.replace(".", "-"), color); // dot notation would imply a class
}

/**
 * colorizes the node with same name (if it exists) in other treemap version
 * 
 * @param codeVersionId the code version id where event node lies 
 * @param nodeId id of event node
 * @param color color to be used
 */
function colorizeOtherNode(codeVersionId: string, nodeId: string, color: string) {
    const otherCodeVersionId = codeVersionId === "newVersion" ? "oldVersion" : "newVersion";
    const otherId = `#${otherCodeVersionId}-${nodeId}`;
    const otherNode = select(otherId);
    if (!otherNode.empty()) {
        // console.log(otherNode.node());
        // console.log(`recolored ${otherId} with color ${color}`);
        otherNode.style("fill", color);
        // console.log(`${otherNode.style("fill")}`);
    }
}

/**
 * 
 * Creates the attribute table for a box
 * 
 * @param treemapNode the selected treemapNode
 */
function createAttributeList(treemapNode: VisualNode) {
    const codeVersion = select(event.currentTarget.closest(".codeVersion"));
    const attributeList = codeVersion.select(".attributes");
    if (!attributeList.select("table").empty()) {
        attributeList.select("table").remove();
    }
    const table = attributeList.append("table");
    const headerRow = table.append("tr");
    const headerCellLeft = headerRow.append("th");
    const headerCellRight = headerRow.append("th");

    headerCellLeft.text("name");
    headerCellRight.text(treemapNode.node.name);

    treemapNode.node.attributes.forEach((value: number, key: string) => {
        const row = table.append("tr");
        const td = row.append("td").text(key);
        td.style("cursor", "pointer");
        td.on("mouseover", () => { select(event.currentTarget).style("background", "lightgrey") });
        td.on("mouseout", () => { select(event.currentTarget).style("background", "white") });
        td.on("click", () => {
            codeVersion.select("svg").remove();
            let versionId = codeVersion.attr("id");
            let project = versionId === "oldVersion" ? projects[0] : projects[1];
            createVisualization(project, squarify, metric, 1, codeVersion.attr("id"));
        });
        row.append("td").text(String(value));
    });
}

/**
 * Checks if treemap node is of type "File"
 * 
 * @param treemapNode treemap node to be checked
 */
function isFile(treemapNode: VisualNode): boolean {
    return treemapNode.node.type === "File";
}