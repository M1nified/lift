class Floor {
    constructor(number) {
        this._number = number;
    }
    get number() {
        return this._number;
    }
    set number(val) {
        throw new Error("Cannot change floor number");
    }
    is(floorNumberToCompareWith) {
        return floorNumberToCompareWith === this.number;
    }
    isInBounds(min, max) {
        return this.number <= max && this.number >= min;
    }
}
class Well {
    constructor() {
        this.position = null;
        this.target = null;
        this.isMoving = false;
        this.maxFPS = 1; // Floors Per Second
    }
    get direction() {
        if (!this.target || this.target === this.position) {
            return -1 /* None */;
        }
        else if (this.position.number > this.target.number) {
            return 1 /* Down */;
        }
        else {
            0 /* Up */;
        }
    }
}
class LiftDriver {
    constructor(floorMin, floorMax, numberOfWells) {
        this.wells = new Array();
        this.tasks = new Array();
        this.floorMax = floorMax;
        this.floorMin = floorMin;
    }
    outerButtonAction(info, event) {
        return new Promise((resolve, reject) => {
            if (!info.floor.isInBounds(this.floorMin, this.floorMax)) {
                reject();
            }
            let task = {
                action: 0 /* Pick */,
                target: info.floor
            };
            this.tasks.push(task);
        });
    }
    innerButtonAction(info, event) {
        return new Promise((resolve, reject) => {
            if (!info.floor.isInBounds(this.floorMin, this.floorMax) || !info.destination.isInBounds(this.floorMin, this.floorMax)) {
                reject();
            }
            let task = {
                action: 1 /* Transport */,
                target: info.destination,
                well: info.well
            };
            this.tasks.push(task);
        });
    }
}
//# sourceMappingURL=lift.js.map