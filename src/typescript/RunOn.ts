type EventAction = ()=>any;
type SecondOnArgument = EventAction | boolean;
interface RunOnEvent{
  name : string,
  before : EventAction[],
  after : EventAction[]
}
interface Events{
  [index:string]:RunOnEvent
}
class RunOn{
  private events : Events = {};
  constructor(){

  }
  static parseEvents(events:string):string[]{
    return events.replace(/\s+/igm,' ').split(' ');
  }
  static doNothing(){};
  public on(events:string,secondOnArgument?:SecondOnArgument,before?:boolean):any{
    if(typeof secondOnArgument === 'function'){
      this.addListener(events,secondOnArgument,before);
      return this;  
    }

    if(typeof secondOnArgument === 'boolean' && typeof before === 'undefined'){
      before = secondOnArgument;
    }
    this.runEvent(events,before);
    return this;
  }
  private addListener(events:string,func:EventAction,before?:boolean){
    let eventsarr = RunOn.parseEvents(events);
    eventsarr.forEach((eventName:string)=>{
      if(!this.events[eventName]){
        let empty : RunOnEvent = {
          name : eventName,
          before : [], 
          after : []
        };
        this.events[eventName] = empty;
      }
      if(before)
        this.events[eventName].before.push(func);
      else
        this.events[eventName].after.push(func);
    })
  }
  private runEvent(events:string,before?:boolean){
    // if(!events) throw "Event to be called not specified!";
    let eventsarr = RunOn.parseEvents(events);
    let fstevt = eventsarr[0];
    if(eventsarr.length > 0 && this.events[fstevt]){
      if(before && Array.isArray(this.events[fstevt].before)){
        console.log(1,events,fstevt);
        this.events[fstevt].before.forEach(func=>func());
      }else if(Array.isArray(this.events[fstevt].after)){
        console.log(2,events,fstevt);
        this.events[fstevt].after.forEach(func=>func());
      }
    }
    console.log('run',events)
    return this;
  }
}