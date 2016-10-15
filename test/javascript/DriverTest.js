
describe('Driver', () => {
  let driverInstance;
  beforeEach(()=>{
    driverInstance = new Driver(0,10,2);
  })
  
  describe('outerButtonAction', () => {
    it('should reject if floor out of bounds', (done) => {
      let promise = driverInstance.outerButtonAction({
        direction:0,floor:-1
      })
      promise.catch(()=>{
        done();
      })
    });
      
  });
    
});
  