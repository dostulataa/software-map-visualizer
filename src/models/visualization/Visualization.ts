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

    public createSVG(svgWidth: number, svgHeight: number, codeVersion: Selection<BaseType, unknown, HTMLElement, any>) {
        const visualization = codeVersion.select(".visualization");
        const svgId = `svg-${codeVersion.attr("id")}`;
        const svg = visualization
            .append("svg")
            .attr("id", svgId)
            .attr("width", svgWidth)
            .attr("height", svgHeight);
        this.registerZoomBehavior(visualization);
        return svg;
    }

    public draw(selection: Selection<BaseType, unknown, HTMLElement, any>, layout: Layout, metric: string, treemapAlgorithm: TreemapAlgorithm = TreemapAlgorithm.Squarified, startDepth: number = Infinity) {
        const rootNode = this.project.nodes[0];
        let nodes: VisualNode[];
        switch (layout) {
            case Layout.Treemap:
                nodes = this.createTreemapNodes(rootNode, treemapAlgorithm, metric);
                break;
            case Layout.TreemapStreet:
                nodes = streetMap(rootNode, metric, treemapAlgorithm, startDepth).layout();
                break;
            default:
                nodes = streetMap(rootNode, metric).layout();
                break;
        }
        this.drawNodes(nodes, selection, metric);
    }

    private createTreemapNodes(rootNode: CCNode, treemapAlgorithm: TreemapAlgorithm, metric: string): VisualNode[] {
        let treemap: Treemap;

        switch (treemapAlgorithm) {
            case TreemapAlgorithm.Strip:
                treemap = new StripTreemap(rootNode, metric);
                break;
            case TreemapAlgorithm.Squarified:
                treemap = new SquarifiedTreemap(rootNode, metric);
                break;
            default:
                treemap = new SliceDiceTreemap(rootNode, metric);
                break;
        }

        treemap.calculateDimension(metric);
        return treemap.layout(new Point(0, 0));
    }

    private registerZoomBehavior(visualization: Selection<BaseType, unknown, HTMLElement, any>) {
        const typedVisualization = visualization as Selection<Element, unknown, HTMLElement, any>;
        const svg = typedVisualization.select("svg");
        const zoomBehavior = zoom().scaleExtent([.1, 15]).on("zoom", () => {
            svg
                .selectAll("rect.visualNode")
                .attr("transform", event.transform.toString());
        });
        typedVisualization.call(zoomBehavior);
    }

    private drawNodes(nodes: VisualNode[], display: Selection<BaseType, unknown, HTMLElement, any>, metric: string, leafMargin: number = .3): void {
        const displayId = display.attr("id");
        display.select("svg")
            .selectAll("rect")
            .data(nodes)
            .enter()
            .append('rect')
            .attr("class", "visualNode")
            .attr("id", (visualNode: VisualNode): string => {
                return `${displayId}-${this.replaceIllegalChars(visualNode.node.name)}`
            })
            .attr("x", (visualNode: VisualNode): number => {
                return visualNode.rectangle.topLeft.x + (visualNode.isFile() && visualNode.rectangle.height > leafMargin ? leafMargin : 0)
            })
            .attr("y", (visualNode: VisualNode): number => {
                return visualNode.rectangle.topLeft.y + (visualNode.isFile() && visualNode.rectangle.width > leafMargin ? leafMargin : 0)
            })
            .attr("height", (visualNode: VisualNode): number => {
                return visualNode.rectangle.height - (visualNode.isFile() && visualNode.rectangle.height > 2 * leafMargin ? 2 * leafMargin : 0)
            })
            .attr("width", (visualNode: VisualNode): number => {
                return visualNode.rectangle.width - (visualNode.isFile() && visualNode.rectangle.width > 2 * leafMargin ? 2 * leafMargin : 0)
            })
            .style("fill", (visualNode: VisualNode): Color => {
                return visualNode.color
            })
            .on("mouseover", this.handleMouseEvent)
            .on("mouseout", this.handleMouseEvent)
            .append("svg:title").text((visualNode: VisualNode): string => {
                return `${visualNode.node.name}\n${metric}: ${visualNode.node.size(metric)}`
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
            otherNode.style("fill", color)
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