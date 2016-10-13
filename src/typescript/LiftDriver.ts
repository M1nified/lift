class LiftDriver{

  private floorMin : number;
  private floorMax : number;

  private wells : Well[] = new Array<Well>();

  private tasks : Task[] = new Array<Task>();

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
        target : info.floor
      }
      this.tasks.push(task);
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
      this.tasks.push(task);
    })
  }
}