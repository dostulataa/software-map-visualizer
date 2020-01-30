import validateInputFiles from "./Validation";
import VisualNode from "./models/visualization/VisualNode";
import CCProject from "./models/codeCharta/CCProject";
import oldProject from "./input/codeCharta";
import newProject from "./input/codecharta_2020-01-23_08-15.cc";
import schema from "./schema";
import { select, event, Selection } from "d3-selection";
import Point from "./models/visualization/Point";
import streetMap from "./algorithms/streetMap";
import { zoom } from "d3-zoom";

const inputFiles = [oldProject, newProject];
validateInputFiles(schema, inputFiles); // Checks for input data validity with schema
const projects = inputFiles.map(input => CCProject.create(input)); // Create projects for input files

let svgWidth = 500;
let svgHeight = 350;
const metric = "rloc";

createVisualization(projects[0], streetMap, metric, 0.3, "oldVersion");
createVisualization(projects[1], streetMap, metric, 0.3, "newVersion");

/**
 * Creates the Visualization using d3 for drawing
 * @param project the project that should be visualized
 * @param algorithm the algorithm to be used
 * @param metric the metric to determine a nodes size
 * @param leafMargin margin for leaf nodes to make underlying nodes visible
 * @param versionId id of the version column
 */
function createVisualization(project: CCProject, algorithm: Function, metric: string, leafMargin: number, versionId: string) {
    // REVIEW: wenn man statt Function einen Objekt-Typ verwendet,
    // könnte der Zugriff z.B. der Aufruf von draw() hier typsicher erfolgen.
    const rootStreet = algorithm(project.nodes[0], metric);
    const nodes: VisualNode[] = rootStreet.layout(new Point(0, 0));
    const codeVersion = select(`#${versionId}`);
    codeVersion.select(".title").text(project.projectName);
    const visualization = codeVersion.select(".visualization");

    const svg = visualization
        .append("svg")
        .attr("id", "svg-" + versionId)
        .attr("width", 450)
        .attr("height", 300);

    svg.selectAll("rect")
        .data(nodes)
        .enter()
        .append('rect')
        .attr("class", "visualNode")
        .attr("id", (d: VisualNode): string => { return (versionId + "-" + d.node.name).replace(/\.|\//g, "-") })
        .attr("x", (d: VisualNode): number => { return d.rectangle.topLeft.x + (d.isFile() ? leafMargin : 0) })
        .attr("y", (d: VisualNode): number => { return d.rectangle.topLeft.y + (d.isFile() ? leafMargin : 0) })
        .attr("height", (d: VisualNode): number => { return d.rectangle.height - (d.isFile() && d.rectangle.height > 2 * leafMargin ? 2 * leafMargin : 0) })
        .attr("width", (d: VisualNode): number => { return d.rectangle.width - (d.isFile() && d.rectangle.width > 2 * leafMargin ? 2 * leafMargin : 0) })
        .style("fill", (d: VisualNode): string => { return d.color })
        .on("mouseover", handleMouseover)
        .on("mouseout", handleMouseout)
        .append("svg:title").text((d: VisualNode): string => { return `${d.node.name}\n${metric}: ${d.node.size(metric)}` });

    const zoomBehavior = zoom().extent([[0, 0], [svgWidth, svgHeight]]).scaleExtent([.1, 15]).on("zoom", () => {
        const transform = event.transform;
        svg.selectAll("rect.visualNode").attr("transform", transform.toString());
    });

    (visualization as unknown as Selection<Element, unknown, HTMLElement, any>).call(zoomBehavior);
}

/**
 * Handles mouse going inside of a node. Changes color to highlighting color.
 * 
 * @param visualNode node which event is registered on 
 */
function handleMouseover(visualNode: VisualNode) {
    let color = "lightgrey";
    select(event.currentTarget).style("fill", color);
    const codeVersion = select(event.currentTarget.closest(".codeVersion"));
    const codeVersionId = codeVersion.attr("id");
    colorizeOtherNode(codeVersionId, visualNode.node.name.replace(/\.|\//g, "-"), color); // . and / are not valid
}

/**
 * Handles mouse going out of a node. Reverts color back to original color.
 * 
 * @param visualNode node which event is registered on 
 */
function handleMouseout(visualNode: VisualNode) {
    const color = visualNode.color;
    const target = select(event.currentTarget);
    target.style("fill", color);
    const codeVersion = select(event.currentTarget.closest(".codeVersion"));
    const codeVersionId = codeVersion.attr("id");
    colorizeOtherNode(codeVersionId, visualNode.node.name.replace(/\.|\//g, "-"), color); // . and / are not valid
}

/**
 * colorizes the node with same name (if it exists) in other visualization version
 * 
 * @param codeVersionId the code version id where event node lies 
 * @param nodeId id of event node
 * @param color color to be used
 */
function colorizeOtherNode(codeVersionId: string, nodeId: string, color: string) {
    const otherCodeVersionId = codeVersionId === "newVersion" ? "oldVersion" : "newVersion";
    const otherId = `#${otherCodeVersionId}-${nodeId}`;
    const otherNode = select(otherId);
    if (!otherNode.empty()) otherNode.style("fill", color);
    
}