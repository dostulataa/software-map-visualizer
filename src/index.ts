import validateInputFiles from "./Validation";
import CCProject from "./models/codeCharta/CCProject";
import firstInputProject from "./input/junit5_2018-10-27.cc.json";
import secondInputProject from "./input/junit5_2019-10-26.cc.json";
import schema from "./schema";
import { select, Selection, BaseType } from "d3-selection";
import Visualization, { TreemapAlgorithm } from "./models/visualization/Visualization";
import { Layout } from "./models/visualization/Visualization";

const svgWidth = window.innerWidth / 2;
const svgHeight = window.innerHeight / 2;

init();

/**
 * Creates and initializes both visualizations with default values.
 */
function init() {
    const inputFiles = [firstInputProject, secondInputProject];
    validateInputFiles(schema, inputFiles);
    const projects = inputFiles.map(input => CCProject.create(input)); // Create projects for input files

    const leftDisplay = select("#leftDisplay");
    const rightDisplay = select("#rightDisplay");

    setTitle(leftDisplay, projects[0].projectName);
    setTitle(rightDisplay, projects[1].projectName);

    const leftVisualization = new Visualization(projects[0]);
    const rightVisualization = new Visualization(projects[1]);

    registerRedrawButtonHandler(leftDisplay, leftVisualization);
    registerRedrawButtonHandler(rightDisplay, rightVisualization);

    leftVisualization.createSVG(svgWidth, svgHeight, leftDisplay);
    rightVisualization.createSVG(svgWidth, svgHeight, rightDisplay);
    leftVisualization.draw(leftDisplay, Layout.Street, "rloc");
    rightVisualization.draw(rightDisplay, Layout.Street, "rloc");
}

function registerRedrawButtonHandler(display: Selection<BaseType, unknown, HTMLElement, any>, visualization: Visualization) {
    display.select("button.redraw").on("click", () => {
        const metric = getMetric(display);
        const layout = getLayout(display);
        const depth = getDepth(display);
        const treemapAlgorithm = getTreemapAlgorithm(display);
        // const project = getProject(version);
        // visualization.project = project;
        display.select("svg").remove();
        visualization.createSVG(svgWidth, svgHeight, display);
        visualization.draw(display, layout, metric, treemapAlgorithm, depth);
    });
}

// function getProject(version: Selection<BaseType, unknown, HTMLElement, any>): CCProject {
//     const projectOption = version.select(".projectOption").node() as HTMLInputElement;
//     const fr = new FileReader();
// }

function getMetric(version: Selection<BaseType, unknown, HTMLElement, any>): string {
    const metricOption = version.select(".metricOption").node() as HTMLSelectElement;
    return metricOption.value;
}

function getLayout(version: Selection<BaseType, unknown, HTMLElement, any>): Layout {
    const layoutOptions = version.select(".layoutOption").node() as HTMLSelectElement;
    const selectedLayout = layoutOptions.options[layoutOptions.selectedIndex].value;

    switch (selectedLayout) {
        case "streetLayout":
            return Layout.Street;
        case "treemap":
            return Layout.Treemap;
        case "treemapStreet":
            return Layout.TreemapStreet;
        default:
            throw new Error("Layout not specified");
    }
}

function getDepth(version: Selection<BaseType, unknown, HTMLElement, any>): number {
    const selectedDepth = version.select(".depthOption").node() as HTMLInputElement;
    return Number(selectedDepth.value);
}

function getTreemapAlgorithm(version: Selection<BaseType, unknown, HTMLElement, any>): TreemapAlgorithm {
    const treemapOptions = version.select(".treemapOption").node() as HTMLSelectElement;
    const selectedTreemapAlgorithm = treemapOptions.options[treemapOptions.selectedIndex].value;

    switch (selectedTreemapAlgorithm) {
        case "strip":
            return TreemapAlgorithm.Strip;
        case "squarified":
            return TreemapAlgorithm.Squarified;
        case "sliceDice":
            return TreemapAlgorithm.SliceAndDice
        default:
            throw new Error("Treemap layout not specified.");
    }
}

function setTitle(codeVersion: Selection<BaseType, unknown, HTMLElement, any>, name: string): void {
    const projectName = name !== "" ? name : "Unnamed Project";
    codeVersion
        .select(".title")
        .text(projectName);
}