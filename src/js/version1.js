
var cartesian = require('cartesian-product');

var compile = function(constraints,options={explicit: false }){
  var engine = {
    options,
    constraints,
    constraintIndex: {},
    getConstraintTypes: function() {
      return Object.keys(this.constraintIndex)},
    // getConsistencyCheck: function(node1,node2){
    //   var answer = {
    //     consistent: true,
    //     failedconstraints: []
    //   }
    //     Object.keys(engine.constraintIndex).forEach(function(constraintType){
    //       var aconstraint = engine.constraintIndex[constraintType];
    //       if(!aconstraint.constrainedNodes[node1]&&!aconstraint.constrainedNodes[node2] ){
    //         if(options.explicit){
    //           answer.consistent = false;
    //           answer.failedconstraints.push(constraintType);
    //         }
    //       } else {
    //         var exist = aconstraint.consistent[node1+":"+node2]
    //         if(!exist){
    //           answer.consistent = false;
    //           answer.failedconstraints.push(constraintType);
    //         }
    //       }
    //     })
    //     return answer;
    // },
      getConsistencyCheck: function(node1,node2){
        if(options.explicit){
          return this.getExplictConsistencyCheck(node1,node2);
        }

        var answer = {
          consistent: false,
          failedconstraints: []
        }

        var applicableConstraints = false;
        Object.keys(engine.constraintIndex).forEach(function(constraintType){
          var aconstraint = engine.constraintIndex[constraintType];
          if(aconstraint.constrainedNodes[node1] ||aconstraint.constrainedNodes[node2]){
            applicableConstraints = true;
          }
        }) 
        if(!applicableConstraints){
          answer.consistent = true;
          return answer;
        }

        Object.keys(engine.constraintIndex).forEach(function(constraintType){
          var aconstraint = engine.constraintIndex[constraintType];          
          if( aconstraint.consistent[node1+":"+node2] ){
              answer.consistent = true;
              return answer;          
          }            
        })

        // Object.keys(engine.constraintIndex).forEach(function(constraintType){
        //   var aconstraint = engine.constraintIndex[constraintType];
        //   if(aconstraint.constrainedNodes[node1]&&aconstraint.constrainedNodes[node2] ){          
        //     var exist = aconstraint.consistent[node1+":"+node2]        
        //     if(!exist){
        //       answer.consistent = false;
        //       answer.failedconstraints.push(constraintType);
        //     }
        //   }
        // })
        
        return answer;
    },getExplictConsistencyCheck: function(node1,node2){
      var answer = {
        consistent: false,
        failedconstraints: []
      }

      var applicableConstraints = false;
      Object.keys(engine.constraintIndex).forEach(function(constraintType){
        var aconstraint = engine.constraintIndex[constraintType];
        if(aconstraint.constrainedNodes[node1] ||aconstraint.constrainedNodes[node2]){
          applicableConstraints = true;
        }
      }) 
      if(!applicableConstraints){
        return answer;
      }

      Object.keys(engine.constraintIndex).forEach(function(constraintType){
        var aconstraint = engine.constraintIndex[constraintType];
        if(aconstraint.constrainedNodes[node1]&&aconstraint.constrainedNodes[node2] ){          
          var exist = aconstraint.consistent[node1+":"+node2]
          if(exist)
            answer.consistent = true;        
        }
      })
      return answer;
    },
    getSatisfied: function(entity){
      var answer = { result: true, unsatisifiedConstraints: [] };
      Object.keys(engine.constraintIndex).forEach(function(constraintType){
        var aconstraint = engine.constraintIndex[constraintType];
        if(aconstraint.satisfied[entity]!=undefined && !aconstraint.satisfied[entity]){
          answer.result=false
          answer.unsatisifiedConstraints.push(aconstraint.constraintName);
        }
      })
      return answer;
    },
    reset: function(){
      var constraintTypes = this.getConstraintTypes();
      var constraintIndex = this.constraintIndex;
      constraintTypes.forEach(function(constraintType){
        var constraint = constraintIndex[constraintType];   
        Object.keys(constraint.satisfied).forEach(function(node){
          constraint.satisfied[node]=false;
        })        
      })
    },
    capture: function(entity1,entity2){
      var answer = false;
      Object.keys(engine.constraintIndex).forEach(function(constraintType){
         var aconstraint = engine.constraintIndex[constraintType];
         if(aconstraint.consistent[entity1+":"+entity2]){
            aconstraint.satisfied[entity1]=true;
            aconstraint.satisfied[entity2]=true;
         }
      });
      return answer;
    },

    init: function(){
      var constraintTypes={};
      constraints.forEach(function(constraint){
        var constraintType = constraintTypes[constraint.sourcename];
        if(!constraintType){
          constraintType={};
          constraintTypes[constraint.sourcename]=constraintType;
        }
        var relationshipType = constraintType[constraint.type];
        if(!relationshipType){
          relationshipType = {};
          constraintType[constraint.type] ={};
          constraintType[constraint.type]=relationshipType;
        }
        relationshipType[constraint.target]=constraint.target;
      })

      Object.keys(constraintTypes).forEach(function(constraintType){
        var constraintRelations = constraintTypes[constraintType];
        var consistent = {};
        var consistentIndex = {};
        var constrainedNodes={};
        var satisfied={};
        var constraint = {
          constraintName: constraintType,
          satisfied,
          constrainedNodes,
          consistent,
          consistentIndex,
          constraintRelations
        };        
        engine.constraintIndex[constraintType]=constraint;
        var sets = Object.keys(constraintRelations);
        var set1 = Object.keys(constraintRelations[sets[0]]);
        var set2 = Object.keys(constraintRelations[sets[1]]);
        cartesian([set1,set2]).forEach(function(pair){
          consistent[pair[0]+":"+pair[1]]=true;
          consistent[pair[1]+":"+pair[0]]=true;
          constrainedNodes[pair[0]]=true;
          constrainedNodes[pair[1]]=true;
          if(!consistentIndex[pair[0]]){
            consistentIndex[pair[0]]=[];
          }
          consistentIndex[pair[0]].push(pair[1])
          if(!consistentIndex[pair[1]]){
            consistentIndex[pair[1]]=[];
          }
          consistentIndex[pair[1]].push(pair[0])
        })
        Object.keys(constraint.constrainedNodes).forEach(function(node){
          constraint.satisfied[node]=false;
        })
      })
      this.reset();
    }
  };

  engine.init();

  return engine;
}

module.exports = { compile };
