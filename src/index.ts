import validateInputFiles from "./Validation";
import CCProject from "./models/codeCharta/CCProject";
import firstInputProject from "./input/junit5_2018-10-27.cc";
import secondInputProject from "./input/junit5_2019-10-26.cc";
import schema from "./schema";
import { select, Selection, BaseType } from "d3-selection";
import Visualization, { TreemapAlgorithm } from "./models/visualization/Visualization";
import { Layout } from "./models/visualization/Visualization";

const svgWidth = window.innerWidth / 2.5;
const svgHeight = window.innerHeight / 1.5;

init();

/**
 * Creates and initializes both visualizations with default values.
 */
function init() {
    const inputFiles = [firstInputProject, secondInputProject];
    validateInputFiles(schema, inputFiles);
    const projects = inputFiles.map(input => CCProject.create(input)); // Create projects for input files

    const leftVersion = select("#oldVersion");
    const rightVersion = select("#newVersion");

    createTitle(leftVersion, projects[0].projectName);
    createTitle(rightVersion, projects[1].projectName);

    const leftVis = new Visualization(projects[0]);
    const rightVis = new Visualization(projects[1]);

    registerRedrawButtonHandler(leftVersion, leftVis);
    registerRedrawButtonHandler(rightVersion, rightVis);

    leftVis.createSVG(svgWidth, svgHeight, leftVersion);
    rightVis.createSVG(svgWidth, svgHeight, rightVersion);
    leftVis.draw(leftVersion, Layout.Street, "rloc");
    rightVis.draw(rightVersion, Layout.Street, "rloc");
}

function registerRedrawButtonHandler(version: Selection<BaseType, unknown, HTMLElement, any>, visualization: Visualization) {
    version.select("button.redraw").on("click", () => {
        const metric = getMetric(version);
        const layout = getLayout(version);
        const depth = getDepth(version);
        const treemapAlgorithm = getTreemapAlgorithm(version);
        version.select("svg").remove();
        visualization.createSVG(svgWidth, svgHeight, version);
        visualization.draw(version, layout, metric, treemapAlgorithm, depth);
    });
}

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
    }
    return Layout.Street;
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
        default:
            return TreemapAlgorithm.SliceAndDice;
    }
}

function createTitle(codeVersion: Selection<BaseType, unknown, HTMLElement, any>, name: string): void {
    codeVersion
        .select(".title")
        .text(name);
}