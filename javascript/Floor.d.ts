declare class Floor {
    private number;
    constructor(number: number);
    is(floorNumberToCompareWith: any): boolean;
    isInBounds(min: any, max: any): boolean;
}
