class Floor{
  private _number : number;
  get number(){
    return this._number;
  }
  set number(val:number){
    throw new Error("Cannot change floor number");
  }

  constructor(number:number){
    this._number = number;
  }

  public is(floorToCompareWith:number|Floor):boolean{
    if(typeof floorToCompareWith === 'number'){
      return floorToCompareWith === this.number;
    }else{
      return floorToCompareWith.number === this.number;
    }
  }
  public isInBounds(min,max):boolean{
    return this.number<=max && this.number>=min;
  }
}