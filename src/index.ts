import validateInputFiles from "./Validation";
import Rectangle from "./models/treemap/Rectangle";
import TreemapNode from "./models/treemap/TreemapNode";
import CCProject from "./models/codeCharta/CCProject";
import junit2018 from "./input/junit5_2018-10-27.cc";
import junit2019 from "./input/junit5_2019-10-26.cc";
import schema from "./schema";
import { select, event } from "d3-selection";
import squarify from "./algorithms/squarified";

const inputFiles = [junit2018, junit2019];
validateInputFiles(schema, inputFiles); // Checks for input data validity with schema

const treemapWidth = 600;
const treemapHeight = 400;
const projects = inputFiles.map(input => CCProject.create(input)); // Create projects for input files
const metric = "rloc";

const highlight: string[] = ["ReflectionUtilsTests.java", "VintageTestEngineDiscoveryTests.java",
    "ReflectionSupport.java", "DefaultParallelExecutionConfigurationStrategy.java",
    "ParameterizedTestIntegrationTests.java"];

createTreemap(projects[0], squarify, new Rectangle([0, 0], [treemapWidth, treemapHeight]), metric, 1, "oldVersion");
createTreemap(projects[1], squarify, new Rectangle([0, 0], [treemapWidth, treemapHeight]), metric, 1, "newVersion");

/**
 * Creates the Treemap using d3 for drawing
 * @param project the project that should be visualized
 * @param algorithm the treemap algorithm to be used
 * @param canvas the canvas where a treemap is drawn on
 * @param metric the metric to determine a nodes size
 * @param leafMargin margin for leaf nodes to make underlying nodes visible
 * @param versionId id of the version column
 */
function createTreemap(project: CCProject, algorithm: Function, canvas: Rectangle, metric: string, leafMargin: number, versionId: string) {
    let nodes: TreemapNode[] = algorithm(project.nodes, canvas, metric);

    const codeVersion = select(`#${versionId}`);

    codeVersion.select(".title").text(project.projectName);

    const svg = codeVersion.select(".treemap")
        .append("svg")
        .attr("width", canvas.width())
        .attr("height", canvas.height());

    const groups = svg.selectAll(".groups")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "treemapNode");

    groups.append('rect')
        .attr("id", (d: TreemapNode): string => { return versionId + "-" + d.node.name })
        .attr("x", (d: TreemapNode): number => { return d.rectangle.posX() + (isFile(d) ? leafMargin : 0) })
        .attr("y", (d: TreemapNode): number => { return d.rectangle.posY() + (isFile(d) ? leafMargin : 0) })
        .attr("height", (d: TreemapNode): number => { return d.rectangle.height() - (isFile(d) && d.rectangle.height() > 2 * leafMargin ? 2 * leafMargin : 0) })
        .attr("width", (d: TreemapNode): number => { return d.rectangle.width() - (isFile(d) && d.rectangle.width() > 2 * leafMargin ? 2 * leafMargin : 0) })
        .attr("fill", (d: TreemapNode): string => { return isFile(d) ? (highlight.includes(d.node.name) ? "blue" : "LightSteelBlue") : "SteelBlue" })
        .on("mouseover", () => { select(event.currentTarget).style("fill", "lightgrey") })
        .on("mouseout", (d: TreemapNode) => { select(event.currentTarget).style("fill", (isFile(d) ? (highlight.includes(d.node.name) ? "blue" : "LightSteelBlue") : "SteelBlue")) })
        .on("click", createAttributeList);
}

/**
 * 
 * Creates the attribute table for a box
 * 
 * @param treemapNode the selected treemapNode
 */
function createAttributeList(treemapNode: TreemapNode) {

    const codeVersion = select(event.currentTarget.closest(".codeVersion"));
    const attributeContainer = codeVersion.select(".attributes");
    if (!attributeContainer.select("table").empty()) {
        attributeContainer.select("table").remove();
    }
    const table = attributeContainer.append("table");

    const headerRow = table.append("tr");
    const headerCellLeft = headerRow.append("th");
    const headerCellRight = headerRow.append("th");

    headerCellLeft.text("name");
    headerCellRight.text(treemapNode.node.name);

    treemapNode.node.attributes.forEach((value: number, key: string) => {
        const row = table.append("tr");
        let td = row.append("td").text(key);
        td.style("cursor", "pointer");
        td.on("mouseover", () => { select(event.currentTarget).style("background", "lightgrey") });
        td.on("mouseout", () => { select(event.currentTarget).style("background", "white") });
        td.on("click", function () {
            codeVersion.select("svg").remove();
            let versionId = codeVersion.attr("id");
            let project = versionId === "oldVersion" ? projects[0] : projects[1];
            createTreemap(project, squarify, new Rectangle([0, 0], [treemapWidth, treemapHeight]), event.currentTarget.textContent, 1, codeVersion.attr("id"));
        });
        row.append("td").text(String(value));
    });
}

function isFile(treemapNode: TreemapNode): boolean {
    return treemapNode.node.type === "File";
}