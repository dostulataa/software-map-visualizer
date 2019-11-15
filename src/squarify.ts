import Box from "./Box";
import Rect from "./Rect";

const nodes : Box[] = [
    new Box("1", new Rect([0, 0], [250, 500]), new Map([["param1", 1], ["param2", 1]]), "Folder"),
    new Box("1.1", new Rect([0, 0], [250, 250]), new Map([["param1", 2], ["param2", 1]]), "File"),
    new Box("1.2", new Rect([0, 250], [250, 250]), new Map([["param1", 1], ["param2", 1]]), "Folder"),
    new Box("1.2.1", new Rect([0, 250], [125, 250]), new Map([["param1", 2], ["param2", 1]]), "File"),
    new Box("1.2.2", new Rect([125, 250], [125, 250]), new Map([["param1", 2], ["param2", 1]]), "File"),
    new Box("2", new Rect([250, 0], [250, 500]), new Map([["param1", 1], ["param2", 1]]), "Folder"),
    new Box("2.1", new Rect([250, 0], [250, 500]), new Map([["param1", 2], ["param2", 1]]), "File")
];

export function squarify(children: number[], row: number, w: number) {



    return nodes;
}