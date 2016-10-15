
describe('Floor', () => {
  let floorInstance;
  beforeEach(()=>{
    floorInstance = new Floor(2);
  })
  describe('isInBounds', () => {
    
    it('should be false if not in bounds', () => {
      expect(floorInstance.isInBounds(3,4)).toBe(false);
      expect(floorInstance.isInBounds(-1,1)).toBe(false);
      expect(floorInstance.isInBounds(0,1)).toBe(false);
    });
    
    it('should be true if in bounds', () => {
      expect(floorInstance.isInBounds(1,2)).toBe(true);
      expect(floorInstance.isInBounds(2,3)).toBe(true);
      expect(floorInstance.isInBounds(1,3)).toBe(true);
    });
      
      
  });
    
});
  