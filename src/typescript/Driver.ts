class Driver{

  private floorMin : number;
  private floorMax : number;

  private wells : Well[] = new Array<Well>();

  private _tasks : Task[] = new Array<Task>();
  public get tasks(){
    return this._tasks;
  }
  public set tasks(val){
  }

  private on = new RunOn();

  constructor(floorMin:number,floorMax:number,numberOfWells:number){
    this.floorMax = floorMax;
    this.floorMin = floorMin;
  }

  public outerButtonAction(info:OuterButtonAction, event?:Object){
    return new Promise((resolve,reject)=>{
      if(!info.floor.isInBounds(this.floorMin,this.floorMax)){
        reject();
      }
      let task : Task = {
        action : TaskAction.Pick,
        target : info.floor,
        direction : info.direction
      }
      this._tasks.push(task);
      resolve();
    })
  }
  public innerButtonAction(info:InnerButtonAction, event?:Object){
    return new Promise((resolve,reject)=>{
      if(!info.floor.isInBounds(this.floorMin,this.floorMax) || !info.destination.isInBounds(this.floorMin,this.floorMax)){
        reject();
      }
      let task : Task = {
        action : TaskAction.Transport,
        target : info.destination,
        well : info.well
      }
      this._tasks.push(task);
      resolve();
    })
  }
  public popTask = this.popTasks;
  public popTasks(tasks:Task[]|Task):Task[]{
    let tasksArr = !Array.isArray(tasks) ? [tasks] : tasks;
    let tasksToPopArr = [];
    this.tasks = this.tasks.filter((thistask)=>{
      let index = tasksArr.findIndex((tasktopop)=>{
        return Object.is(tasktopop,thistask);
      })
      if(index !== -1){
        tasksToPopArr.push(tasksArr[index]);
        return false;
      }
      return true;
    })
    return tasksToPopArr;
  }
}