describe("Well",function(){
  describe("askDriverForTasks",function(){
    let wellInstance = null;

    beforeEach(function(){
      wellInstance = new Well(0,10,{tasks:[
        {action:0,target:new Floor(4),direction:0},
        {action:0,target:new Floor(4),direction:1},
        {action:0,target:new Floor(2),direction:0},
        {action:0,target:new Floor(3),direction:0}
      ]});
      wellInstance.position = 3;
    })

    it("should return first task on the way",function(){
      
    })

  })
})