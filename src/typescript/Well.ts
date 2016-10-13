class Well{
  
  private position : Floor = null;
  private target : Floor = null;
  private isMoving : boolean = false;
  private route : Task[] = null;
  private driver : LiftDriver = undefined;
  
  get direction():Directions{
    if(!this.target || this.target === this.position){
      return Directions.None;
    }else if(this.position.number > this.target.number){
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
    if(direction === Directions.Up){
      if(this.position.is(this.floorMax)) return false;
      this.target = new Floor(this.position.number+1);
    }
    if(direction === Directions.Down){
      if(this.position.is(this.floorMin)) return false;
      this.target = new Floor(this.position.number-1);
    }
    this.isMoving = true;
    if(this.shouldStopAt(this.target)){
      setTimeout(this.stopAtFloor,this._speedTimeout);
    }else{
      setTimeout(this.passAFloor,this._speedTimeout);
    }
  }
  private passAFloor(){
    this.runOn.on('passAFloor',true);
    
    this.runOn.on('passAFloor',false);
  }
  private stopAtFloor(){
    this.runOn.on('stopAtFloor',true);

    this.runOn.on('stopAtFloor',false);
  }
  private shouldStopAt(floor:Floor){
    for(let task of this.route){
      if(task.target.is(floor)){
        if(task.action === TaskAction.Transport || task.action === TaskAction.Pick && task.direction === this.direction){
        return true;
        }
      }
    }
    return false;
  }

  
}