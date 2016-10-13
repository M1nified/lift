declare class LiftDriver {
    private tasks;
    private floorMin;
    private floorMax;
    constructor(floorMin: number, floorMax: number);
    outerButtonAction(info: OuterButtonAction, event?: Object): void;
}
