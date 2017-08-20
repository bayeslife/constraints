var assert = require('assert');

var constraints = require("../index.js");

var constraint1Name = "Constraint-Entity1ConsistentWithEntity2"
var entity1 = { id: "entity1"}
var entity2 = { id: "entity2"}
var entity3 = { id: "entity3"}

var unconstrained1 = { id: "unconstrained1"}
var unconstrained2 = { id: "unconstrained2"}

var singleConstraint = [
  {
    source: constraint1Name,
    sourcename: constraint1Name,
    target: entity1.id,
    type: "Association"
  },
  {
    source: constraint1Name,
    sourcename: constraint1Name,
    target: entity2.id,
    type: "Dependency"
  }
]

var constraint2Name = "Constraint-Entity1ConsistentWithEntity2andEntity3"
var doubleConstraint = singleConstraint.concat([
  {
    source: constraint2Name,
    sourcename: constraint2Name,
    target: entity1.id,
    type: "Association"
  },
  {
    source: constraint2Name,
    sourcename: constraint2Name,
    target: entity2.id,
    type: "Dependency"
  },
  {
    source: constraint2Name,
    sourcename: constraint2Name,
    target: entity3.id,
    type: "Dependency"
  }
]);

var constraint3Name = "Constraint-Entity1ConsistentWithEntity3"
var tripleConstraint = doubleConstraint.concat([
  {
    source: constraint3Name,
    sourcename: constraint3Name,
    target: entity1.id
  },
  {
    source: constraint3Name,
    sourcename: constraint3Name,
    target: entity3.id
  }
]);

describe('Given an explicit constraint engine', function() {  
  var constraintEngineExplicit
  before(function(){
     constraintEngineExplicit = constraints.compile(singleConstraint,{explicit: true}); 
  })
  describe('When there is a single constraint', function() {
    it('Then unconstrainted nodes are not consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(unconstrained1.id,unconstrained2.id);
      assert(!result.consistent);
    });
  });
})

describe('Given a constraint engine', function() {
  var constraintEngine;  
  before(function(){
     constraintEngine = constraints.compile(singleConstraint);    
  })
  describe('When there is a single constraint', function() {
      it('Then there is a single constraint indexed', function() {
          assert.equal(constraintEngine.getConstraintTypes().length,1 );
      });

      it('Then the constrained nodes are consistent', function() {
        var result = constraintEngine.getConsistencyCheck(entity2.id,entity1.id);
          assert(result.consistent);
      });
      it('Then the constrainted nodes are consistent the other way around', function() {
          var result = constraintEngine.getConsistencyCheck(entity1.id,entity2.id);
          assert(result.consistent);
      });
      it('Then unconstrainted nodes are consistent ', function() {
        var result = constraintEngine.getConsistencyCheck(unconstrained1.id,unconstrained2.id);
        assert(result.consistent);
      });
      it('Then constrained and unconstrainted nodes are not consistent ', function() {
        var result = constraintEngine.getConsistencyCheck(entity1.id,unconstrained1.id)
        assert(!result.consistent);
      });
  });

  describe('When there is are 2 constraint', function() {
      before(function(){
        constraintEngine = constraints.compile(doubleConstraint);
      })
      it('Then there is 2 constraints indexed', function() {
          assert.equal(constraintEngine.getConstraintTypes().length,2 );
      });
      it('Then the constrained nodes are consistent', function() {
          var result = constraintEngine.getConsistencyCheck(entity2.id,entity1.id);
          assert(result.consistent);
      });
      it('Then the constrainted nodes are consistent the other way around', function() {
        var result = constraintEngine.getConsistencyCheck(entity1.id,entity2.id)
          assert(result.consistent);
      });      
      it('Then entities which dont satisfy both constraints are inconsistent', function() {
          var consistency = constraintEngine.getConsistencyCheck(entity1.id,entity3.id);
          assert(!consistency.consistent);
      });
  });

    describe('When there is are 3 constraints which make all combinations invalid', function() {
        before(function(){
          constraintEngine = constraints.compile(tripleConstraint);
        })
        it('Then consistent combinations are identified', function() {
            assert.equal(constraintEngine.getConstraintTypes().length,3 );
        });
        it('Then inconsistent combinations are identified', function() {
            var result = constraintEngine.getConsistencyCheck(entity1.id,entity2.id);
            assert(!result.consistent);
            assert.equal(result.failedconstraints[0],constraint3Name)
        });
    });

    describe('When there is a single constraint', function() {
      before(function(){
        constraintEngine = constraints.compile(singleConstraint);    
      })
      describe('and no consistent pair captured', function() {
        it('Then the nodes are not satisfied', function() {
           assert(!constraintEngine.getSatisfied(entity1.id));
           assert(!constraintEngine.getSatisfied(entity2.id));            
        });
      });
      describe('and a consistent pair captured', function() {
        before(function(){
          constraintEngine.capture(entity1.id,entity2.id);
        })
        it('Then the constrained nodes are satisfied', function() {
           assert(constraintEngine.getSatisfied(entity1.id));
           assert(constraintEngine.getSatisfied(entity2.id));            
        });
        it('Then the constrained nodes are satisfied', function() {
          assert(constraintEngine.getSatisfied(entity1.id));
          assert(constraintEngine.getSatisfied(entity2.id));            
        });
        it('Then unspecified nodes are satisfied', function() {
          assert(constraintEngine.getSatisfied(entity3.id));          
        });
      });
      
  });

  describe('When there is a double constraint', function() {
      before(function(){
        constraintEngine = constraints.compile(doubleConstraint);
      })
      describe('and no consistent pair captured', function() {
        it('Then the nodes are not satisfied', function() {
           assert(!constraintEngine.getSatisfied(entity1.id));
           assert(!constraintEngine.getSatisfied(entity2.id));
           assert(!constraintEngine.getSatisfied(entity3.id));            
        });
      });
      describe('and a consistent pair captured', function() {
        before(function(){
          constraintEngine.capture(entity1.id,entity2.id);
        })
        it('Then the constrained nodes are satisfied', function() {
           assert(constraintEngine.getSatisfied(entity1.id));
           assert(constraintEngine.getSatisfied(entity2.id));            
        });
        it('Then unreferenced nodes are not satisfied', function() {          
          assert(!constraintEngine.getSatisfied(entity3.id));
        });
      });
   
  });

});
