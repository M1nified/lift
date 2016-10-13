class LiftDriver {
    constructor(floorMin, floorMax) {
        this.floorMax = floorMax;
        this.floorMin = floorMin;
    }
    outerButtonAction(info, event) {
        return new Promise((resolve, reject) => {
            if (!info.floor.isInBounds(this.floorMin, this.floorMax)) {
            }
            let task = {
                action: 0 /* Pick */,
                target: info.floor
            };
        });
    }
}
//# sourceMappingURL=LiftDriver.js.map