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
class RunOn {
    constructor() {
        this.events = {};
    }
    static parseEvents(events) {
        return events.replace(/\s+/igm, ' ').split(' ');
    }
    static doNothing() { }
    ;
    on(events, secondOnArgument, before) {
        if (typeof secondOnArgument === 'function') {
            this.addListener(events, secondOnArgument, before);
            return this;
        }
        if (typeof secondOnArgument === 'boolean' && typeof before === 'undefined') {
            before = secondOnArgument;
        }
        this.runEvent(events, before);
        return this;
    }
    addListener(events, func, before) {
        let eventsarr = RunOn.parseEvents(events);
        eventsarr.forEach((eventName) => {
            if (!this.events[eventName]) {
                let empty = {
                    name: eventName,
                    before: [],
                    after: []
                };
                this.events[eventName] = empty;
            }
            if (before)
                this.events[eventName].before.push(func);
            else
                this.events[eventName].after.push(func);
        });
    }
    runEvent(events, before) {
        // if(!events) throw "Event to be called not specified!";
        let eventsarr = RunOn.parseEvents(events);
        let fstevt = eventsarr[0];
        if (eventsarr.length > 0 && this.events[fstevt]) {
            if (before && Array.isArray(this.events[fstevt].before)) {
                console.log(1, events, fstevt);
                this.events[fstevt].before.forEach(func => func());
            }
            else if (Array.isArray(this.events[fstevt].after)) {
                console.log(2, events, fstevt);
                this.events[fstevt].after.forEach(func => func());
            }
        }
        console.log('run', events);
        return this;
    }
}
class LiftDriver {
    constructor(floorMin, floorMax, numberOfWells) {
        this.wells = new Array();
        this.tasks = new Array();
        this.on = new RunOn();
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