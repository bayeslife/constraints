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

var constraintOneOfName = "Constraint Entity1 must of One Of Entity2 or Entity3"
var oneOfConstraint = [
  {
    name: constraintOneOfName,
    stereotype: "OneOf",
    source: [
      {
        id: entity1.id,
        name: entity1.id
      }
    ],
    target: [
      {
        id: entity2.id,
        name: entity2.id
      },
      {
        id: entity3.id,
        name: entity3.id
      }
    ]
  }
]

describe('Given a constraint2 engine', function() {
  var constraintEngineExplicit
  before(function(){
     constraintEngineExplicit = constraints.compile2(oneOfConstraint);
  })
  describe('When there is a ONEOF constraint', function() {
    it('Then unrelated nodes are consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(unconstrained1.id,unconstrained2.id);
      assert(result.consistent);
    });
    it('Then src and target are consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(entity1.id,entity2.id);
      assert(result.consistent);
    });
    it('Then src and second target are consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(entity1.id,entity3.id);
      assert(result.consistent);
    });
    it('Then src without target is not consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(entity1.id,entity4.id);
      assert(result.consistent);
    });
  });
})

describe('When there is a OneOf constraint', function() {
  before(function(){
    constraintEngine = constraints.compile2(oneOfConstraint);
  })
  describe('and no pair captured', function() {
    it('Then the src is not satisifed', function() {
       assert(!constraintEngine.getSatisfied(entity1.id).result);
    });
    it('And target is satisfied', function() {
      assert(constraintEngine.getSatisfied(entity2.id).result);
   });
  });
  describe('and a consistent pair captured', function() {
    before(function(){
      constraintEngine.reset();
      constraintEngine.capture(entity1.id,entity2.id);
    })
    it('Then the src nodes a satisfied', function() {
       assert(constraintEngine.getSatisfied(entity1.id).result);
    });
    it('And the target nodes are satisfied', function() {
      assert(constraintEngine.getSatisfied(entity2.id).result);
   });
  })
  describe('and an unconstrained pair captured', function() {
    before(function(){
      constraintEngine.reset();
      constraintEngine.capture(entity1.id,entity4.id);
    })
    it('Then the src is not satisfied', function() {
       assert(!constraintEngine.getSatisfied(entity1.id).result);
    });
    it('And the target is satisfied', function() {
      assert(constraintEngine.getSatisfied(entity4.id).result);
   });
  })
})


///////////////

var constraintCanName = "Constraint Entity1 Can Only Have Entity2 and Entity3"
var canConstraint = [
  {
    name: constraintCanName,
    stereotype: "CanOnly",
    source: [
      {
        id: entity1.id,
        name: entity1.id
      }
    ],
    target: [
      {
        id: entity2.id,
        name: entity2.id
      },
      {
        id: entity3.id,
        name: entity3.id
      }
    ]
  }
]

describe('Given a constraint2 engine', function() {
  var constraintEngineExplicit
  before(function(){
     constraintEngineExplicit = constraints.compile2(canConstraint);
  })
  describe('When there is a CANONLY constraint', function() {
    it('Then unrelated nodes are consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(unconstrained1.id,unconstrained2.id);
      assert(result.consistent);
    });
    it('Then src and target are consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(entity1.id,entity2.id);
      assert(result.consistent);
    });
    it('Then src without target is consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(entity1.id,entity4.id);
      assert(!result.consistent);
    });
  });
})

describe('When there is a CANONLY constraint', function() {
  before(function(){
    constraintEngine = constraints.compile2(canConstraint);
  })
  describe('and no pair captured', function() {
    it('Then the src is not satisfied but the target is', function() {
       assert(constraintEngine.getSatisfied(entity1.id).result);
       assert(constraintEngine.getSatisfied(entity2.id).result);
    });
  });
  describe('and a consistent pair captured', function() {
    before(function(){
      constraintEngine.reset();
      constraintEngine.capture(entity1.id,entity2.id);
    })
    it('Then the src nodes a satisfied', function() {
       assert(constraintEngine.getSatisfied(entity1.id).result);
    });
    it('And the target nodes are satisfied', function() {
      assert(constraintEngine.getSatisfied(entity2.id).result);
   });
  })
  describe('and a inconsistent pair captured', function() {
    before(function(){
      constraintEngine.reset();
      constraintEngine.capture(entity1.id,entity4.id);
    })
    it('Then the src is satisfied', function() {
       assert(!constraintEngine.getSatisfied(entity1.id).result);
    });
    it('And the target is satisfied', function() {
      assert(constraintEngine.getSatisfied(entity4.id).result);
   });
  })
})


////////////

var constraintMustName = "Constraint Entity1 Must Have Entity2"
var mustConstraint = [
  {
    name: constraintMustName,
    stereotype: "Must",
    source: [
      {
        id: entity1.id,
        name: entity1.id
      }
    ],
    target: [
      {
        id: entity2.id,
        name: entity2.id
      }
    ]
  }
]

describe('Given an explicit constraint2 engine', function() {
  var constraintEngineExplicit
  before(function(){
     constraintEngineExplicit = constraints.compile2(mustConstraint,{explicit: false});
  })
  describe('When there is a MUST constraint', function() {
    it('Then unrelated nodes are consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(unconstrained1.id,unconstrained2.id);
      assert(result.consistent);
    });
    it('Then constrained nodes are consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(entity1.id,entity2.id);
      assert(result.consistent);
    });
    it('Then src with unrelated target is consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(entity1.id,entity3.id);
      assert(result.consistent);
    });
  });
})

describe('When there is a MUST constraint', function() {
  before(function(){
    constraintEngine = constraints.compile2(mustConstraint);
  })
  describe('and no pair captured', function() {
    it('Then the src is not satisfied but the target is', function() {
       assert(!constraintEngine.getSatisfied(entity1.id).result);
       assert(constraintEngine.getSatisfied(entity2.id).result);
    });
  });
  describe('and a pair captured', function() {
    before(function(){
      constraintEngine.reset();
      constraintEngine.capture(entity1.id,entity2.id);
    })
    it('Then the src nodes a satisfied', function() {
       assert(constraintEngine.getSatisfied(entity1.id).result);
       assert(constraintEngine.getSatisfied(entity2.id).result);
    });
  })
  describe('and a inconsistent pair captured', function() {
    before(function(){
      constraintEngine.reset();
      constraintEngine.capture(entity1.id,entity3.id);
    })
    it('Then the src is not satisfied', function() {
       assert(!constraintEngine.getSatisfied(entity1.id).result);
    });
    it('And the target is satisfied', function() {
      assert(constraintEngine.getSatisfied(entity3.id).result);
   });
  })
})

//////////////



var singleConstraint = [
  {
    name: constraint1Name,
    stereotype: "Consistent",
    source: [
      {
        id: entity1.id,
        name: entity1.id
      }
    ],
    target: [
      {
        id: entity2.id,
        name: entity2.id
      }
    ]
  }
]

var doubleConstraint = singleConstraint.concat([
  {
    name: constraint2Name,
    stereotype: "Consistent",
    source: [
      {
        id: entity1.id ,
        name: entity1.id
      }
    ],
    target: [
      {
        id: entity2.id ,
        name: entity2.id
      },
      {
        id: entity3.id ,
        name: entity3.id
      }
    ]
  }
]);

var tripleConstraint = doubleConstraint.concat([
  {
    name: constraint3Name,
    stereotype: "Consistent",
    source: [
      {
        id: entity1.id ,
        name: entity1.id
      }
    ],
    target: [
      {
        id: entity3.id ,
        name: entity3.id
      }
    ]
  }
]);

describe('Given an explicit constraint2 engine', function() {
  var constraintEngineExplicit
  before(function(){
     constraintEngineExplicit = constraints.compile2(singleConstraint,{explicit: true});
  })
  describe('When there is a single constraint', function() {
    it('Then unconstraint are consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(unconstrained1.id,unconstrained2.id);
      assert(result.consistent);
    });
    it('Then constrained nodes are consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(entity1.id,entity2.id);
      assert(result.consistent);
    });
  });
})

describe('Given a constraint2 engine', function() {
  var constraintEngine;
  before(function(){
     constraintEngine = constraints.compile2(singleConstraint,{explicit: true});
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
        constraintEngine = constraints.compile2(doubleConstraint);
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
      it('Then entities that satisfy one constraint are consistent', function() {
          var consistency = constraintEngine.getConsistencyCheck(entity1.id,entity3.id);
          assert(consistency.consistent);
      });
  });

  describe('When there are 3 constraints which make all combinations invalid', function() {
      before(function(){
        constraintEngine = constraints.compile2(tripleConstraint,{explicit: true});
      })
      it('Then consistent combinations are identified', function() {
          assert.equal(constraintEngine.getConstraintTypes().length,3 );
      });
      it('Then inconsistent combinations are identified', function() {
          var result = constraintEngine.getConsistencyCheck(entity1.id,entity2.id);
          assert(!result.consistent);
          assert.equal(result.failedconstraints.length,1)
      });
  });

    describe('When there is a explict constraint engine and a single constraint', function() {
      before(function(){
        constraintEngine = constraints.compile2(singleConstraint,{explicit: true});
      })
      describe('and no consistent pair captured', function() {
        it('Then the src is not satisfied', function() {
           assert(!constraintEngine.getSatisfied(entity1.id).result);
        });
        it('Then the target is not satisfied', function() {
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
        it('Then unspecified nodes are satisfied', function() {
          assert(constraintEngine.getSatisfied(entity3.id).result);
        });
      });
  });

  describe('When there is a double constraint', function() {
      before(function(){
        constraintEngine = constraints.compile2(doubleConstraint);
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
  {
    name: constraint1Name,
    stereotype: "Consistent",
    source: [
      {
        id: entity1.id,
        name: entity1.id
      }
    ],
    target: [
      {
        id: entity2.id,
        name: entity2.id
      }
    ]
  },
  {
    name: constraint4Name,
    stereotype: "Consistent",
    source: [
      {
        id: entity3.id,
        name: entity3.id
      }
    ],
    target: [
      {
        id: entity2.id,
        name: entity2.id
      }
    ]
  }
]

var unchainedConstraint = [
  {
    name: constraint1Name,
    stereotype: "Consistent",
    source: [
      {
        id: entity1.id,
        name: entity1.id,
      }
    ],
    target: [
      {
        id: entity2.id,
        name: entity2.id,
      }
    ]
  },
  {
    name: constraint5Name,
    stereotype: "Consistent",
    source: [
      {
        id: entity3.id,
        name: entity3.id,
      }
    ],
    target: [
      {
        id: entity4.id,
        name: entity4.id
      }
    ]
  }
]

 describe('Given a constraint2 engine', function() {
    var constraintEngine;
    before(function(){
      constraintEngine = constraints.compile2(chainedConstraint);
    })
    describe('When there are chained constraints', function() {
        it('Then there is a first is consistent with the second', function() {
            var result = constraintEngine.getConsistencyCheck(entity1.id,entity2.id);
            assert(result.consistent);
        });
        it('And third entities is consistent with the second ', function() {
          var result = constraintEngine.getConsistencyCheck(entity2.id,entity3.id);
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
      constraintEngine = constraints.compile2(unchainedConstraint,{explicit: true});
    })
    describe('When there are unchained constraints', function() {
      it('Then the first entities are not consistent', function() {
          var result = constraintEngine.getConsistencyCheck(entity1.id,entity4.id);
          assert(!result.consistent);          
      });
      it('Then the 4th entities are not consistent', function() {        
        var result = constraintEngine.getConsistencyCheck(entity4.id,entity1.id);
        assert(!result.consistent);
    });
    })
  })


var emergentConstraints = [
  {
    name: constraint2Name,
    stereotype: "Consistent",
    source: [
      {
        id: entity1.id ,
        name: entity1.id
      },
      {
        id: entity2.id ,
        name: entity2.id
      }
    ],
    target: [
      {
        id: entity1a.id ,
        name: entity1a.id
      },
      {
        id: entity2a.id ,
        name: entity2a.id
      }
    ]
  }
]

describe('Given an explicit constraints2 engine', function() {
  var constraintEngineExplicit
  before(function(){
     constraintEngineExplicit = constraints.compile2(emergentConstraints,{explicit: true});
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
      it('Then unconstrained nodes are consistent ', function() {
      var result = constraintEngineExplicit.getConsistencyCheck(unconstrained1.id,unconstrained2.id);
      assert(result.consistent);
    });
  });
})
