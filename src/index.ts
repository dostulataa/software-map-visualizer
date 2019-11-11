import Box from "./box";
import Rect from "./rect";
import { select, event } from "d3-selection";

const svg_width: number = 500;
const svg_height: number = 500;

const margin = { top: 5, right: 5, bottom: 5, left: 5 };

const boxes: Box[] = [
    new Box("1", new Rect(0, 0, 250, 500), new Map([["type", "Folder"], ["param2", "param2"]])),
    new Box("1.1", new Rect(0, 0, 250, 250), new Map([["type", "File"], ["param2", "param2"]])),
    new Box("1.2", new Rect(0, 250, 250, 250), new Map([["type", "Folder"], ["param2", "param2"]])),
    new Box("1.2.1", new Rect(0, 250, 125, 250), new Map([["type", "File"], ["param2", "param2"]])),
    new Box("1.2.2", new Rect(125, 250, 125, 250), new Map([["type", "File"], ["param2", "param2"]])),
    new Box("2", new Rect(250, 0, 250, 500), new Map([["type", "Folder"], ["param2", "param2"]])),
    new Box("2.1", new Rect(250, 0, 250, 500), new Map([["type", "File"], ["param2", "param2"]]))
];

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
    .attr("x", (d: Box): number => { return d.rect.x + (isFile(d) ? margin.left : 0) })
    .attr("y", (d: Box): number => { return d.rect.y + (isFile(d) ? margin.top : 0) })
    .attr("height", (d: Box): number => { return d.rect.height - (isFile(d) ? margin.top + margin.bottom : 0) })
    .attr("width", (d: Box): number => { return d.rect.width - (isFile(d) ? margin.left + margin.right : 0) })
    .attr("fill", (d: Box): string => { return isFile(d) ? "LightSteelBlue" : "SteelBlue" })
    .on("mouseover", () => { select(event.currentTarget).style("fill", "lightgrey") })
    .on("mouseout", (d: Box) => { select(event.currentTarget).style("fill", (isFile(d) ? "LightSteelBlue" : "SteelBlue")) })
    .on("click", createParamList);

groups.append('text')
    .text((d: Box): string => { return d.parameters.get("type") === "File" ? d.name : "" })
    .attr("x", (d: Box): number => { return d.rect.x + d.rect.width / 2 })
    .attr("y", (d: Box): number => { return d.rect.y + d.rect.height / 2 })
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

    d.parameters.forEach((v: string, k: string) => {
        let row: HTMLElement = document.createElement("tr");
        let cell1: HTMLElement = document.createElement("td");
        let cell2: HTMLElement = document.createElement("td");

        table.appendChild(row);
        row.appendChild(cell1);
        row.appendChild(cell2);
        cell1.appendChild(document.createTextNode(k));
        cell2.appendChild(document.createTextNode(v));
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
    return d.parameters.get("type") === "File";
}