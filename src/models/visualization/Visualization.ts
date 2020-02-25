import { select, event, Selection, BaseType } from "d3-selection";
import { zoom } from "d3-zoom";
import CCProject from "../codeCharta/CCProject";
import VisualNode, { Color } from "./VisualNode";
import streetMap from "../../algorithms/streetAlgorithm";
import StripTreemap from "../Treemap/StripTreemap";
import Treemap from "../Treemap/Treemap";
import SquarifiedTreemap from "../Treemap/SquarifiedTreemap";
import CCNode from "../codeCharta/CCNode";
import SliceDiceTreemap from "../Treemap/SliceDiceTreemap";
import Point from "./Point";

export enum Layout {
    Street,
    TreemapStreet,
    Treemap
};

export enum TreemapAlgorithm {
    SliceAndDice,
    Squarified,
    Strip
};

export default class Visualization {

    public project: CCProject;

    constructor(project: CCProject) {
        this.project = project;
    }

    /**
     * Creates svg in corresponding display
     * @param svgWidth width of the svg
     * @param svgHeight height of the svg
     * @param display display where svg should be created
     */
    public createSVG(svgWidth: number, svgHeight: number, display: Selection<BaseType, unknown, HTMLElement, any>) {
        const visualization = display.select(".visualization");
        const svgId = `svg-${display.attr("id")}`;
        const svg = visualization
            .append("svg")
            .attr("id", svgId)
            .attr("width", svgWidth)
            .attr("height", svgHeight);
        
        this.registerZoomBehavior(visualization);
        return svg;
    }

    /**
     * Creates layout with chosen options.
     * @param display display on which nodes are to be drawn
     * @param layout layout to be used
     * @param metricName metric by which nodes are scaled
     * @param treemapAlgorithm treemap algorithm for TMStreet
     * @param treemapDepth depth where treemaps substitute streets
     */
    public draw(display: Selection<BaseType, unknown, HTMLElement, any>, layout: Layout, metricName: string, treemapAlgorithm: TreemapAlgorithm = TreemapAlgorithm.Squarified, treemapDepth: number = Infinity) {
        const rootNode = this.project.nodes[0];
        let nodes: VisualNode[];
        switch (layout) {
            case Layout.Treemap:
                nodes = this.createTreemapNodes(rootNode, treemapAlgorithm, metricName);
                break;
            case Layout.TreemapStreet:
                nodes = streetMap(rootNode, metricName, treemapAlgorithm, treemapDepth).layout(new Point(0, 0));
                break;
            default:
                nodes = streetMap(rootNode, metricName).layout(new Point(0, 0));
                break;
        }
        this.drawNodes(nodes, display, metricName);
    }

    /**
     * Creates a treemap layout.
     * @param rootNode root node of treemap
     * @param treemapAlgorithm algorithm that should be used for treemap
     * @param metricName metric by which nodes are scaled
     */
    private createTreemapNodes(rootNode: CCNode, treemapAlgorithm: TreemapAlgorithm, metricName: string): VisualNode[] {
        let treemap: Treemap;

        switch (treemapAlgorithm) {
            case TreemapAlgorithm.Strip:
                treemap = new StripTreemap(rootNode, metricName);
                break;
            case TreemapAlgorithm.Squarified:
                treemap = new SquarifiedTreemap(rootNode, metricName);
                break;
            default:
                treemap = new SliceDiceTreemap(rootNode, metricName);
                break;
        }

        treemap.calculateDimension(metricName);
        return treemap.layout();
    }

    /**
     * Makes svg zoomable and translateable.
     * @param display display where zoom behavior should be registered
     */
    private registerZoomBehavior(display: Selection<BaseType, unknown, HTMLElement, any>) {
        const typedDisplay = display as Selection<Element, unknown, HTMLElement, any>;
        const svg = typedDisplay.select("svg");
        const zoomBehavior = zoom().scaleExtent([.1, 15]).on("zoom", () => {
            svg
                .selectAll("rect.visualNode")
                .attr("transform", event.transform.toString());
        });
        typedDisplay.call(zoomBehavior);
    }

    /**
     * Draws nodes on svg and adds information.
     * @param nodes nodes to be drawn
     * @param display display of svg where nodes are drawn on
     * @param metricName metric that 
     * @param leafMargin margin on file nodes
     */
    private drawNodes(nodes: VisualNode[], display: Selection<BaseType, unknown, HTMLElement, any>, metricName: string, leafMargin: number = .3): void {
        const displayId = display.attr("id");
        display.select("svg")
            .selectAll("rect")
            .data(nodes)
            .enter()
            .append('rect')
            .attr("class", "visualNode")
            .attr("id", (visualNode: VisualNode): string => {
                return `${displayId}-${this.replaceIllegalChars(visualNode.node.name)}`;
            })
            .attr("x", (visualNode: VisualNode): number => {
                return visualNode.rectangle.topLeft.x + (visualNode.isFile() && visualNode.rectangle.height > leafMargin ? leafMargin : 0);
            })
            .attr("y", (visualNode: VisualNode): number => {
                return visualNode.rectangle.topLeft.y + (visualNode.isFile() && visualNode.rectangle.width > leafMargin ? leafMargin : 0);
            })
            .attr("height", (visualNode: VisualNode): number => {
                return visualNode.rectangle.height - (visualNode.isFile() && visualNode.rectangle.height > 2 * leafMargin ? 2 * leafMargin : 0);
            })
            .attr("width", (visualNode: VisualNode): number => {
                return visualNode.rectangle.width - (visualNode.isFile() && visualNode.rectangle.width > 2 * leafMargin ? 2 * leafMargin : 0);
            })
            .style("fill", (visualNode: VisualNode): Color => {
                return visualNode.color;
            })
            .on("mouseover", this.handleMouseEvent)
            .on("mouseout", this.handleMouseEvent)
            .append("svg:title").text((visualNode: VisualNode): string => {
                return `${visualNode.node.name}\n${metricName}: ${visualNode.node.size(metricName)}`;
            });
    }

    /**
     * Handles mouse going in or out of a node. Reverts color back to original color.
     * 
     * @param visualNode node which event is registered on 
     */
    private handleMouseEvent(visualNode: VisualNode) {
        let color = visualNode.color;
        if (event.type === "mouseover") {
            color = Color.Highlighted;
        }
        select(event.currentTarget).style("fill", color);
        const display = select(event.currentTarget.closest(".display"));
        const displayId = display.attr("id");
        const nodeId = Visualization.prototype.replaceIllegalChars(visualNode.node.name);
        Visualization.prototype.colorizeOtherNode(displayId, nodeId, color);
    }

    /**
     * colorizes the node with same name (if it exists) in other visualization version
     * 
     * @param displayId the code version id where event node lies 
     * @param nodeId id of event node
     * @param color color to be used
     */
    private colorizeOtherNode(displayId: string, nodeId: string, color: string) {
        const otherDisplayId = displayId === "rightDisplay" ? "leftDisplay" : "rightDisplay";
        const otherId = `#${otherDisplayId}-${nodeId}`;
        const otherNode = select(otherId);
        if (!otherNode.empty()) {
            otherNode.style("fill", color);
        };
    }

    /**
     * Replaces all '/' and '.' in a string with '-'.
     * Makes IDs useable as DOM Element id
     * @param name 
     */
    private replaceIllegalChars(name: string): string {
        return name.replace(/\.|\//g, "-");
    }
}