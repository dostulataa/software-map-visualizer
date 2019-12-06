import validateInputFiles from "./Validation";
import Rectangle from "./models/treemap/Rectangle";
import TreemapNode from "./models/treemap/TreemapNode";
import Project from "./models/codeCharta/Project";
import junit2018 from "./input/junit5_2018-10-27.cc";
import junit2019 from "./input/junit5_2019-10-26.cc";
import schema from "./schema";
import { select, event } from "d3-selection";
import squarify from "./algorithms/squarified";

const inputFiles = [junit2018, junit2019];
validateInputFiles(schema, inputFiles); // Checks for input data validity with schema

const treemapWidth = 600;
const treemapHeight = 400;
const projects = inputFiles.map(input => Project.create(input)); // Create projects for input files
const metric = "rloc";

const highlight: string[] = ["ReflectionUtilsTests.java", "VintageTestEngineDiscoveryTests.java", 
                            "ReflectionSupport.java", "DefaultParallelExecutionConfigurationStrategy.java",
                            "ParameterizedTestIntegrationTests.java"];

createTreemap(projects[0], squarify, new Rectangle([0, 0], [treemapWidth, treemapHeight]), metric, 1, false, "leftColumn");
createTreemap(projects[1], squarify, new Rectangle([0, 0], [treemapWidth, treemapHeight]), metric, 1, false, "rightColumn");

/**
 * Creates the Treemap using d3 for drawing
 * @param project the project that should be visualized
 * @param algorithm the treemap algorithm to be used
 * @param canvas the canvas where a treemap is drawn on
 * @param metric the metric to determine a nodes size
 * @param leafMargin margin for leaf nodes to make underlying nodes visible
 * @param labels labels in treemap nodes ('true' only recommended for small projects)
 */
function createTreemap(project: Project, algorithm: Function, canvas: Rectangle, metric: string, leafMargin: number, labels: boolean, colId: string) {
    let nodes: TreemapNode[] = algorithm(project.nodes, canvas, metric);

    const column = select("#"+colId);

    column.select(".title").text(project.projectName);

    const svg = column.select(".treemap")
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
        .attr("id", (d:TreemapNode): string => { return colId + "-" + d.node.name})
        .attr("x", (d: TreemapNode): number => { return d.rect.posX() + (isFile(d) ? leafMargin : 0) })
        .attr("y", (d: TreemapNode): number => { return d.rect.posY() + (isFile(d) ? leafMargin : 0) })
        .attr("height", (d: TreemapNode): number => { return d.rect.height() - (isFile(d) && d.rect.height() > 2 * leafMargin ? 2 * leafMargin : 0) })
        .attr("width", (d: TreemapNode): number => { return d.rect.width() - (isFile(d) && d.rect.width() > 2 * leafMargin ? 2 * leafMargin : 0) })
        .attr("fill", (d: TreemapNode): string => { return isFile(d) ? (highlight.includes(d.node.name) ? "blue" : "LightSteelBlue") : "SteelBlue" })
        .on("mouseover", () => { select(event.currentTarget).style("fill", "lightgrey") })
        .on("mouseout", (d: TreemapNode) => { select(event.currentTarget).style("fill", (isFile(d) ? (highlight.includes(d.node.name) ? "blue" : "LightSteelBlue") : "SteelBlue")) })
        .on("click", createAttributeList);

    if (labels) {
        groups.append('text')
            .text((d: TreemapNode): string => { return isFile(d) ? d.node.name : "" })
            .attr("x", (d: TreemapNode): number => { return d.rect.posX() + d.rect.width() / 2 })
            .attr("y", (d: TreemapNode): number => { return d.rect.posY() + d.rect.height() / 2 })
            .attr("text-anchor", "middle");
    }
}

/**
 * 
 * Creates the attribute table for a box
 * 
 * @param treemapNode the selected treemapNode
 */
function createAttributeList(treemapNode: TreemapNode) {

    const column = select(event.currentTarget.closest(".column"));
    const attributeContainer = column.select(".attributes");
    if(!attributeContainer.select("table").empty()) {
        attributeContainer.select("table").remove();
    }
    const table = attributeContainer.append("table");
    
    let headerRow = table.append("tr");
    let headerCellLeft = headerRow.append("th");
    let headerCellRight = headerRow.append("th");

    headerCellLeft.text("name");
    headerCellRight.text(treemapNode.node.name);

    treemapNode.node.attributes.forEach((value: number, key: string) => {
        const row = table.append("tr")
        row.append("td").text(key);
        row.append("td").text(String(value))
    });
}

function isFile(treemapNode: TreemapNode): boolean {
    return treemapNode.node.type === "File";
}