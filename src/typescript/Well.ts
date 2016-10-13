class Well{
  
  private position : Floor = null;
  private target : Floor = null;
  private isMoving : boolean = false;
  
  get direction():Directions{
    if(!this.target || this.target === this.position){
      return Directions.None;
    }else if(this.position.number > this.target.number){
      return Directions.Down;
    }else{
      Directions.Up;
    }
  }

  public maxFPS : number = 1; // Floors Per Second

  constructor(){

  }

  
}