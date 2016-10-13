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

  public is(floorNumberToCompareWith:number):boolean{
    return floorNumberToCompareWith === this.number;
  }
  public isInBounds(min,max):boolean{
    return this.number<=max && this.number>=min;
  }
}