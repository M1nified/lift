class Well{
  
  private _position : Floor = null;
  public get position(){return this._position;}
  public set position(val:number|Floor){
    this._position = typeof val === 'number' ? new Floor(val) : val;
  }
  private target : Floor = null;
  private isMoving : boolean = false;
  private route : Task[] = null;
  private driver : Driver = undefined;
  
  get direction():Directions{
    if(!this.target || this.target === this._position){
      return Directions.None;
    }else if(this._position.number > this.target.number){
      return Directions.Down;
    }else{
      Directions.Up;
    }
  }

  public _maxFPS : number = 1; // Floors Per Second
  private _speedTimeout : number = 1000/this._maxFPS;
  set maxFPS(val){
    this._maxFPS = val;
    this._speedTimeout = 1000/this._maxFPS;
  }
  get maxFPS(){
    return this._maxFPS;
  }

  public runOn : RunOn = new RunOn();

  private floorMin : Floor = undefined;
  private floorMax : Floor = undefined;

  constructor(floorMin,floorMax,driver?){
    this.floorMin = floorMin;
    this.floorMax = floorMax;
    if(driver) this.driver = driver;
  }

  public move(direction:Directions){
    if(this.isMoving) return false;
    let shouldStopAtNextGate = false;
    this.askDriverForTasks(direction);
    if(direction === Directions.Up){
      if(this._position.is(this.floorMax)) return false;
      this.target = new Floor(this._position.number+1);
    }
    if(direction === Directions.Down){
      if(this._position.is(this.floorMin)) return false;
      this.target = new Floor(this._position.number-1);
    }
    this.isMoving = true;
    if(this.shouldItStopAt(this.target)){
      setTimeout(this.stopAtFloor,this._speedTimeout);
    }else{
      setTimeout(this.passAFloor,this._speedTimeout);
    }
  }
  private passAFloor(){
    this.runOn.on('passAFloor',true);
    this.move(this.direction);
    this.runOn.on('passAFloor',false);
  }
  private stopAtFloor(){
    this.runOn.on('stopAtFloor',true);
    this.isMoving = false;
    this.openDoor();
    this.closeDoor();
    this.move(this.direction);
    this.runOn.on('stopAtFloor',false);
  }
  private openDoor(){
    this.runOn.on('openDoor',true);

    this.runOn.on('openDoor',false);
  }
  private closeDoor(){
    this.runOn.on('closeDoor',true);

    this.runOn.on('closeDoor',false);
  }
  private shouldItStopAt(floor:Floor){
    for(let task of this.route){
      if(task.target.is(floor)){
        if(task.action === TaskAction.Transport || task.action === TaskAction.Pick && task.direction === this.direction){
        return true;
        }
      }
    }
    return false;
  }
  private askDriverForTasks(direction:Directions){
    let tasksInTheSameDirection = this.driver.tasks.filter((task,index)=>{
      console.log(index,task)
      return (
        direction === Directions.Up 
        && task.target.number >= this._position.number
        || direction == Directions.Down
        && task.target.number <= this._position.number
      )
      &&
      (
        task.direction === direction 
        || task.action === TaskAction.Transport
      ) ? true : false;
    });
    let sortedTasks = tasksInTheSameDirection.sort((a,b)=>{
      return a.target.number - b.target.number;
    });
    if(sortedTasks.length === 0) return null;
    let fst = null;
    if(direction === Directions.Up){
      fst = sortedTasks[0];
    }else{
      fst = sortedTasks[sortedTasks.length-1];
    }
    let tasksToPick = sortedTasks.filter((task,index)=>{
      return task.target.is(fst.target) ? true : false;
    });
    let pickedTasks = this.driver.popTasks(tasksToPick);
    this.route.concat(pickedTasks);
    return this;
  }
  
}