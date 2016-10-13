describe("RunOn",function(){

  it("should parse events from string to array",function(){

    expect(RunOn.parseEvents("click move")).toEqual(jasmine.arrayContaining(['click','move']));

  })

  let runOnInstance = null;
  describe("RunOn Instance single events",function(){
    beforeEach(function(done){
      runOnInstance = new RunOn();
      done();
    })

    it("should register and fire single before event",function(done){
      runOnInstance.on('click1',()=>{
        console.log('click1')
        done();
      },true)
      runOnInstance.on('click1',true)
    });

    it("should register and fire single after event",function(done){
      runOnInstance.on('click2',()=>{
        done();
      });
      runOnInstance.on('click2');
    })
    
    it("should register and fire single after event explicit",function(done){
      runOnInstance.on('click3',()=>{
        done();
      },false);
      runOnInstance.on('click3',false);
    })

    
    it("should register and fire single after event mixed",function(done){
      runOnInstance.on('click4',()=>{
        done();
      });
      runOnInstance.on('click4',false);
    })
    it("should register and fire single after event mixed2",function(done){
      runOnInstance.on('click5',()=>{
        done();
      },false);
      runOnInstance.on('click5');
    })

    afterEach(function(done){
      done();
    })
  })

  describe("RunOn Instance multiple events",function(){
    beforeEach(function(done){
      runOnInstance = new RunOn();
      done();
    })

    it("should register and fire multiple after events",function(done){
      runOnInstance.on('click7 click8',()=>{
        console.log('click7 click8');
        done();
      });
      runOnInstance.on('click8');
    },5000)
    
    afterEach(function(done){
      done();
    })
  });

  describe("RunOn Instance",function(){
    beforeEach(function(){
      runOnInstance = new RunOn();
    })

    it("should not throw if event is not registered",function(){
      let job = runOnInstance.on('not_assigned_event');
      expect(job).not.toBeNull();
      expect(job).not.toBeUndefined();
    });
  })

})