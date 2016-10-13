class Floor {
    constructor(number) {
        this.number = number;
    }
    is(floorNumberToCompareWith) {
        return floorNumberToCompareWith === this.number;
    }
    isInBounds(min, max) {
        return this.number <= max && this.number >= min;
    }
}
//# sourceMappingURL=Floor.js.map