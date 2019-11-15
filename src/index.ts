import Box from "./models/Box";
import { select, event } from "d3-selection";
import { default as data } from "./sample.cc";
import { sliceAndDice } from "./sliceAndDIce";
import Rect from "./models/Rect";
import Project from "./models/Project";

const svg_width: number = 500;
const svg_height: number = 500;

const margin = { top: 5, right: 5, bottom: 5, left: 5 };

const project: Project = Project.create(data);

const canvas = new Rect([0, 0], [svg_width, svg_height]);

const boxes: Box[] = sliceAndDice(project.nodes[0], canvas.p, canvas.q, 0);

const svg = select("body")
    .append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height);

const groups = svg.selectAll(".groups")
    .data(boxes)
    .enter()
    .append("g")
    .attr("class", "gbar");

groups.append('rect')
    .attr("x", (d: Box): number => { return d.rect.posX() + (isFile(d) ? margin.left : 0) })
    .attr("y", (d: Box): number => { return d.rect.posY() + (isFile(d) ? margin.top : 0) })
    .attr("height", (d: Box): number => { return d.rect.height() - (isFile(d) ? margin.top + margin.bottom : 0) })
    .attr("width", (d: Box): number => { return d.rect.width() - (isFile(d) ? margin.left + margin.right : 0) })
    .attr("fill", (d: Box): string => { return isFile(d) ? "LightSteelBlue" : "SteelBlue" })
    .on("mouseover", () => { select(event.currentTarget).style("fill", "lightgrey") })
    .on("mouseout", (d: Box) => { select(event.currentTarget).style("fill", (isFile(d) ? "LightSteelBlue" : "SteelBlue")) })
    .on("click", createParamList);

groups.append('text')
    .text((d: Box): string => { return isFile(d) ? d.name : "" })
    .attr("x", (d: Box): number => { return d.rect.posX() + d.rect.width() / 2 })
    .attr("y", (d: Box): number => { return d.rect.posY() + d.rect.height() / 2 })
    .attr("text-anchor", "middle");

function createParamList(d: Box) {
    let table = createTable();
    let header_row: HTMLElement = document.createElement("tr");
    let header_cell1: HTMLElement = document.createElement("th");
    let header_cell2: HTMLElement = document.createElement("th");

    table.appendChild(header_row);
    header_row.appendChild(header_cell1);
    header_row.appendChild(header_cell2);
    header_cell1.appendChild(document.createTextNode("name"));
    header_cell2.appendChild(document.createTextNode(d.name));

    d.attributes.forEach((paramValue: number, paramKey: string) => {
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

function createTable(): HTMLElement {
    let body: HTMLElement = document.body;
    let paramList: HTMLElement | null = document.getElementById("paramList");
    if (paramList) {
        body.removeChild(paramList);
    }
    let table: HTMLElement = document.createElement("table");
    table.setAttribute("id", "paramList");
    table.style.cssText = 'float:right;';
    body.append(table);
    return table;
}

function isFile(d: Box): boolean {
    return d.type === "File";
}