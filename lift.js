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
    is(floorToCompareWith) {
        if (typeof floorToCompareWith === 'number') {
            return floorToCompareWith === this.number;
        }
        else {
            return floorToCompareWith.number === this.number;
        }
    }
    isInBounds(min, max) {
        return this.number <= max && this.number >= min;
    }
}
class Well {
    constructor(floorMin, floorMax, driver) {
        this._position = null;
        this.target = null;
        this.isMoving = false;
        this.route = null;
        this.driver = undefined;
        this._maxFPS = 1; // Floors Per Second
        this._speedTimeout = 1000 / this._maxFPS;
        this.runOn = new RunOn();
        this.floorMin = undefined;
        this.floorMax = undefined;
        this.floorMin = floorMin;
        this.floorMax = floorMax;
        if (driver)
            this.driver = driver;
    }
    get position() { return this._position; }
    set position(val) {
        this._position = typeof val === 'number' ? new Floor(val) : val;
    }
    get direction() {
        if (!this.target || this.target === this._position) {
            return -1 /* None */;
        }
        else if (this._position.number > this.target.number) {
            return 1 /* Down */;
        }
        else {
            0 /* Up */;
        }
    }
    set maxFPS(val) {
        this._maxFPS = val;
        this._speedTimeout = 1000 / this._maxFPS;
    }
    get maxFPS() {
        return this._maxFPS;
    }
    move(direction) {
        if (this.isMoving)
            return false;
        let shouldStopAtNextGate = false;
        this.askDriverForTasks(direction);
        if (direction === 0 /* Up */) {
            if (this._position.is(this.floorMax))
                return false;
            this.target = new Floor(this._position.number + 1);
        }
        if (direction === 1 /* Down */) {
            if (this._position.is(this.floorMin))
                return false;
            this.target = new Floor(this._position.number - 1);
        }
        this.isMoving = true;
        if (this.shouldItStopAt(this.target)) {
            setTimeout(this.stopAtFloor, this._speedTimeout);
        }
        else {
            setTimeout(this.passAFloor, this._speedTimeout);
        }
    }
    passAFloor() {
        this.runOn.on('passAFloor', true);
        this.move(this.direction);
        this.runOn.on('passAFloor', false);
    }
    stopAtFloor() {
        this.runOn.on('stopAtFloor', true);
        this.isMoving = false;
        this.openDoor();
        this.closeDoor();
        this.move(this.direction);
        this.runOn.on('stopAtFloor', false);
    }
    openDoor() {
        this.runOn.on('openDoor', true);
        this.runOn.on('openDoor', false);
    }
    closeDoor() {
        this.runOn.on('closeDoor', true);
        this.runOn.on('closeDoor', false);
    }
    shouldItStopAt(floor) {
        for (let task of this.route) {
            if (task.target.is(floor)) {
                if (task.action === 1 /* Transport */ || task.action === 0 /* Pick */ && task.direction === this.direction) {
                    return true;
                }
            }
        }
        return false;
    }
    askDriverForTasks(direction) {
        let tasksInTheSameDirection = this.driver.tasks.filter((task, index) => {
            console.log(index, task);
            return (direction === 0 /* Up */
                && task.target.number >= this._position.number
                || direction == 1 /* Down */
                    && task.target.number <= this._position.number)
                &&
                    (task.direction === direction
                        || task.action === 1 /* Transport */) ? true : false;
        });
        let sortedTasks = tasksInTheSameDirection.sort((a, b) => {
            return a.target.number - b.target.number;
        });
        if (sortedTasks.length === 0)
            return null;
        let fst = null;
        if (direction === 0 /* Up */) {
            fst = sortedTasks[0];
        }
        else {
            fst = sortedTasks[sortedTasks.length - 1];
        }
        let tasksToPick = sortedTasks.filter((task, index) => {
            return task.target.is(fst.target) ? true : false;
        });
        let pickedTasks = this.driver.popTasks(tasksToPick);
        this.route.concat(pickedTasks);
        return this;
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
class Driver {
    constructor(floorMin, floorMax, numberOfWells) {
        this.wells = new Array();
        this._tasks = new Array();
        this.on = new RunOn();
        this.popTask = this.popTasks;
        this.floorMax = floorMax;
        this.floorMin = floorMin;
    }
    get tasks() {
        return this._tasks;
    }
    set tasks(val) {
    }
    outerButtonAction(info, event) {
        return new Promise((resolve, reject) => {
            if (!info.floor.isInBounds(this.floorMin, this.floorMax)) {
                reject();
            }
            let task = {
                action: 0 /* Pick */,
                target: info.floor,
                direction: info.direction
            };
            this._tasks.push(task);
            resolve();
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
            this._tasks.push(task);
            resolve();
        });
    }
    popTasks(tasks) {
        let tasksArr = !Array.isArray(tasks) ? [tasks] : tasks;
        let tasksToPopArr = [];
        this.tasks = this.tasks.filter((thistask) => {
            let index = tasksArr.findIndex((tasktopop) => {
                return Object.is(tasktopop, thistask);
            });
            if (index !== -1) {
                tasksToPopArr.push(tasksArr[index]);
                return false;
            }
            return true;
        });
        return tasksToPopArr;
    }
}
//# sourceMappingURL=lift.js.map