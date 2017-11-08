var assert = require('assert');

var constraints = require("../index.js");

var entity1 = { id: "entity1"}
var entity1a = { id: "entity1a"}
var entity2 = { id: "entity2"}
var entity2a = { id: "entity2a"}
var entity3 = { id: "entity3"}
var entity4 = { id: "entity4"}
var unconstrained1 = { id: "unconstrained1"}
var unconstrained2 = { id: "unconstrained2"}

var constraint1Name = "Constraint-Entity1ConsistentWithEntity2"
var constraint2Name = "Constraint-Entity1ConsistentWithEntity2andEntity3"
var constraint3Name = "Constraint-Entity1ConsistentWithEntity3"
var constraint4Name = "Constraint-Entity2ConsistentWithEntity3"
var constraint5Name = "Constraint-Entity3ConsistentWithEntity4"


var singleConstraint = [
  { source: constraint1Name, sourcename: constraint1Name, target: entity1.id, type: "Association"},
  { source: constraint1Name, sourcename: constraint1Name, target: entity2.id, type: "Dependency"}
]

var doubleConstraint = singleConstraint.concat([
  { source: constraint2Name, sourcename: constraint2Name, target: entity1.id, type: "Association" },
  { source: constraint2Name, sourcename: constraint2Name, target: entity2.id, type: "Dependency" },
  { source: constraint2Name, sourcename: constraint2Name, target: entity3.id, type: "Dependency"  }
]);

var tripleConstraint = doubleConstraint.concat([
  { source: constraint3Name, sourcename: constraint3Name, target: entity1.id },
  { source: constraint3Name, sourcename: constraint3Name, target: entity3.id }
]);

var emergentConstraints = [
  { source: constraint1Name, sourcename: constraint1Name, target: entity1.id, type: "Association" },
  { source: constraint1Name, sourcename: constraint1Name, target: entity1a.id, type: "Dependency" },
  { source: constraint2Name, sourcename: constraint2Name, target: entity2.id, type: "Association" },
  { source: constraint2Name, sourcename: constraint2Name, target: entity2a.id, type: "Dependency" }
]

describe('Given an explicit constraints engine', function() {
  var constraintEngineExplicit
  before(function(){
     constraintEngineExplicit = constraints.compile(emergentConstraints,{explicit: true});
  })
  describe('When there are emergent constraints', function() {
    it('Then emergent nodes are consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(entity1.id,entity1a.id);
      assert(result.consistent);
    });
    it('Then emergent nodes are consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(entity2.id,entity2a.id);
      assert(result.consistent);
    });
      it('Then non emergent nodes are not consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(unconstrained1.id,unconstrained2.id);
      assert(!result.consistent);
    });
  });
})

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
    it('Then constrainted nodes are consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(entity1.id,entity2.id);
      assert(result.consistent);
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
          assert(consistency.consistent);
      });
  });

  describe('When there are 3 constraints which make all combinations invalid', function() {
      before(function(){
        constraintEngine = constraints.compile(tripleConstraint);
      })
      it('Then consistent combinations are identified', function() {
          assert.equal(constraintEngine.getConstraintTypes().length,3 );
      });
      it('Then inconsistent combinations are identified', function() {
          var result = constraintEngine.getConsistencyCheck(entity1.id,entity2.id);
          assert(result.consistent);
          //assert.equal(result.failedconstraints[0],constraint3Name)
      });
  });

    describe('When there is a single constraint', function() {
      before(function(){
        constraintEngine = constraints.compile(singleConstraint);
      })
      describe('and no consistent pair captured', function() {
        it('Then the nodes are not satisfied', function() {
           assert(!constraintEngine.getSatisfied(entity1.id).result);
           assert(!constraintEngine.getSatisfied(entity2.id).result);
        });
      });
      describe('and a consistent pair captured', function() {
        before(function(){
          constraintEngine.capture(entity1.id,entity2.id);
        })
        it('Then the constrained nodes are satisfied', function() {
           assert(constraintEngine.getSatisfied(entity1.id).result);
           assert(constraintEngine.getSatisfied(entity2.id).result);
        });
        it('Then the constrained nodes are satisfied', function() {
          assert(constraintEngine.getSatisfied(entity1.id).result);
          assert(constraintEngine.getSatisfied(entity2.id).result);
        });
        it('Then unspecified nodes are satisfied', function() {
          assert(constraintEngine.getSatisfied(entity3.id).result);
        });
      });
  });

  describe('When there is a double constraint', function() {
      before(function(){
        constraintEngine = constraints.compile(doubleConstraint);
      })
      describe('and no consistent pair captured', function() {
        it('Then the nodes are not satisfied', function() {
           assert(!constraintEngine.getSatisfied(entity1.id).result);
           assert(!constraintEngine.getSatisfied(entity2.id).result);
           assert(!constraintEngine.getSatisfied(entity3.id).result);
        });
      });
      describe('and a consistent pair captured', function() {
        before(function(){
          constraintEngine.capture(entity1.id,entity2.id);
        })
        it('Then the constrained nodes are satisfied', function() {
           assert(constraintEngine.getSatisfied(entity1.id).result);
           assert(constraintEngine.getSatisfied(entity2.id).result);
        });
        it('Then unreferenced nodes are not satisfied', function() {
          assert(!constraintEngine.getSatisfied(entity3.id).result);
        });
      });
  });

});


// Entity1 constrained with Entity2 and Entity2 Constrained with Entity 3
var chainedConstraint = [
  { source: constraint1Name, sourcename: constraint1Name,target: entity1.id, type: "Association" },
  { source: constraint1Name, sourcename: constraint1Name, target: entity2.id, type: "Dependency" },

  { source: constraint4Name, sourcename: constraint4Name, target: entity3.id, type: "Association" },
  { source: constraint4Name, sourcename: constraint4Name, target: entity2.id, type: "Dependency" }
  ]

var unchainedConstraint = [
  { source: constraint1Name, sourcename: constraint1Name,target: entity1.id, type: "Association" },
  { source: constraint1Name, sourcename: constraint1Name, target: entity2.id, type: "Dependency" },

  { source: constraint5Name, sourcename: constraint5Name, target: entity3.id, type: "Association" },
  { source: constraint5Name, sourcename: constraint5Name, target: entity4.id, type: "Dependency" }
  ]

  describe('Given a constraint engine', function() {
    var constraintEngine;
    before(function(){
      constraintEngine = constraints.compile(chainedConstraint);
    })
    describe('When there are chained constraints', function() {
        it('Then there is a first and third entities are consistent with the second', function() {
            var result = constraintEngine.getConsistencyCheck(entity1.id,entity2.id);
            assert(result.consistent);
            var result = constraintEngine.getConsistencyCheck(entity3.id,entity2.id);
            assert(result.consistent);
        });
    })
    describe('When one chain link is captured', function() {
       before(function(){
          constraintEngine.capture(entity1.id,entity2.id);
        })
      it('Then there is a first entity is satisifed', function() {
          assert(constraintEngine.getSatisfied(entity1.id).result);
      });
      it('Then there is a second entity is not satisifed', function() {
          assert(!constraintEngine.getSatisfied(entity2.id).result);
      });
    })
  });
  describe('Given a constraint engine', function() {
    var constraintEngine;
    before(function(){
      constraintEngine = constraints.compile(unchainedConstraint);
    })
    describe('When there are unchained constraints', function() {
      it('Then there is a first and 4th entities are not consistent', function() {
          var result = constraintEngine.getConsistencyCheck(entity1.id,entity4.id);
          assert(!result.consistent);
          var result = constraintEngine.getConsistencyCheck(entity4.id,entity1.id);
          assert(!result.consistent);
      });
    })
  })
