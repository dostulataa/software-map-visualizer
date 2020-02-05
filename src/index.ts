import validateInputFiles from "./Validation";
import VisualNode, { Color } from "./models/visualization/VisualNode";
import CCProject from "./models/codeCharta/CCProject";
import firstInputProject from "./input/junit5_2018-10-27.cc";
import secondInputProject from "./input/junit5_2019-10-26.cc";
import schema from "./schema";
import { select, event, Selection, BaseType } from "d3-selection";
import { zoom } from "d3-zoom";
import streetMap from "./algorithms/streetMap";

const inputFiles = [firstInputProject, secondInputProject];
validateInputFiles(schema, inputFiles);
const projects = inputFiles.map(input => CCProject.create(input)); // Create projects for input files

createVisualization(projects[0], .3, "oldVersion");
createVisualization(projects[1], .3, "newVersion");

/**
 * Creates the Visualization using d3 for drawing
 * @param project the project that should be visualized
 * @param metric the metric to determine a nodes size
 * @param leafMargin margin for leaf nodes to make underlying nodes visible
 * @param versionId id of the version column
 */
function createVisualization(project: CCProject, leafMargin: number, versionId: string, metric: string = "rloc") {
    const codeVersion = select("#" + versionId);
    const svgWidth = window.innerWidth / 2.5;
    const svgHeight = window.innerHeight / 1.5;
    const nodes = createStreetNodes(project, metric);

    createTitle(codeVersion, project.projectName);
    createSVG(svgWidth, svgHeight, codeVersion);
    drawNodes(nodes, codeVersion, metric, leafMargin);
}

/**
 * Handles mouse going in or out of a node. Reverts color back to original color.
 * 
 * @param visualNode node which event is registered on 
 */
function handleMouseEvent(visualNode: VisualNode) {
    let color = visualNode.color;
    if (event.type === "mouseover") {
        color = Color.Highlighted;
    }
    select(event.currentTarget).style("fill", color);
    const codeVersion = select(event.currentTarget.closest(".codeVersion"));
    const codeVersionId = codeVersion.attr("id");
    const nodeId = DOMifyId(visualNode.node.name)
    colorizeOtherNode(codeVersionId, nodeId, color);
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
    if (!otherNode.empty()) { otherNode.style("fill", color) };
}

function registerZoomBehavior(visualization: Selection<BaseType, unknown, HTMLElement, any>) {
    const typedVisualization = visualization as Selection<Element, unknown, HTMLElement, any>;
    const svg = typedVisualization.select("svg");
    const zoomBehavior = zoom().scaleExtent([.1, 15]).on("zoom", () => {
        svg
            .selectAll("rect.visualNode")
            .attr("transform", event.transform.toString());
    });
    typedVisualization.call(zoomBehavior);
}

// function createTreemapNodes(project: CCProject, width: number, height: number, metric: string): VisualNode[] {
//     const tm = new StripTreemap(project.nodes[0], metric);
//     tm.setDimensions(width, height);
//     return tm.layout();
// }

function createStreetNodes(project: CCProject, metric: string): VisualNode[] {
    const rootStreet = streetMap(project.nodes[0], metric);
    return rootStreet.layout();
}

function createSVG(svgWidth: number, svgHeight: number, codeVersion: Selection<BaseType, unknown, HTMLElement, any>) {
    const visualization = codeVersion.select(".visualization");
    const svgId = `svg-${codeVersion.attr("id")}`;

    const svg = visualization
        .append("svg")
        .attr("id", svgId)
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    registerZoomBehavior(visualization);

    return svg;
}

function drawNodes(nodes: VisualNode[], codeVersion: Selection<BaseType, unknown, HTMLElement, any>, metric: string, leafMargin: number): void {
    const codeVersionId = codeVersion.attr("id");
    codeVersion.select("svg")
        .selectAll("rect")
        .data(nodes)
        .enter()
        .append('rect')
        .attr("class", "visualNode")
        .attr("id", (d: VisualNode): string => { return `${codeVersionId}-${DOMifyId(d.node.name)}` })
        .attr("x", (d: VisualNode): number => { return d.rectangle.topLeft.x + (d.isFile() && d.rectangle.height > leafMargin ? leafMargin : 0) })
        .attr("y", (d: VisualNode): number => { return d.rectangle.topLeft.y + (d.isFile() && d.rectangle.width > leafMargin ? leafMargin : 0) })
        .attr("height", (d: VisualNode): number => { return d.rectangle.height - (d.isFile() && d.rectangle.height > 2 * leafMargin ? 2 * leafMargin : 0) })
        .attr("width", (d: VisualNode): number => { return d.rectangle.width - (d.isFile() && d.rectangle.width > 2 * leafMargin ? 2 * leafMargin : 0) })
        .style("fill", (d: VisualNode): Color => { return d.color })
        .on("mouseover", handleMouseEvent)
        .on("mouseout", handleMouseEvent)
        .append("svg:title").text((d: VisualNode): string => { return `${d.node.name}\n${metric}: ${d.node.size(metric)}` });
}

function createTitle(codeVersion: Selection<BaseType, unknown, HTMLElement, any>, name: string): void {
    codeVersion
        .select(".title")
        .text(name);
}

/**
 * Replaces all '/' and '.' in a string with '-'.
 * Makes IDs useable as DOM Element id
 * @param name 
 */
function DOMifyId(name: string): string {
    return name.replace(/\.|\//g, "-");
}