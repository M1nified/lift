declare const enum Directions {
    Up = 0,
    Down = 1,
}
declare const enum TaskAction {
    Pick = 0,
    Transport = 1,
}
interface OuterButtonAction {
    direction: Directions;
    floor: Floor;
}
interface Task {
    action: TaskAction;
    target: Floor;
}
