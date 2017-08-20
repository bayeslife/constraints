
var cartesian = require('cartesian-product');

var compile = function(constraints={},options={explicit: false }){
  var engine = {
    options,
    constraints,
    constraintIndex: {},
    getConstraintTypes: function() {
      return Object.keys(this.constraintIndex)},
    getConsistencyCheck: function(node1,node2){
      var answer = {
        consistent: true,
        failedconstraints: []
      }
        Object.keys(engine.constraintIndex).forEach(function(constraintType){
          var aconstraint = engine.constraintIndex[constraintType];
          if(!aconstraint.constrainedNodes[node1]&&!aconstraint.constrainedNodes[node2] ){
            if(options.explicit){
              answer.consistent = false;
              answer.failedconstraints.push(constraintType);
            }          
          } else {
            var exist = aconstraint.consistent[node1+":"+node2]
            if(!exist){
              answer.consistent = false;
              answer.failedconstraints.push(constraintType);
            }              
          }          
        })
        return answer;
    },
    getSatisfied: function(entity){
      var answer = true;
      Object.keys(engine.constraintIndex).forEach(function(constraintType){
        var aconstraint = engine.constraintIndex[constraintType];
        if(aconstraint.satisfied[entity]!=undefined && !aconstraint.satisfied[entity])
          answer=false
          
      })
      return answer;
    },
    reset: function(){
      var constraintTypes = this.getConstraintTypes();
      var constraintIndex = this.constraintIndex;
      constraintTypes.forEach(function(constraintType){      
        var constraint = constraintIndex[constraintType];
        var sets = Object.keys(constraint);
        var set1 = Object.keys(constraint[sets[0]]);
        var set2 = Object.keys(constraint[sets[1]]);        
        Object.keys(constraint[sets[0]]).forEach(function(node){
          constraint.satisfied[node]=false;
        })
        Object.keys(constraint[sets[1]]).forEach(function(node){
          constraint.satisfied[node]=false;
        })
      })
    },
    capture: function(entity1,entity2){
      var answer = false;
      Object.keys(engine.constraintIndex).forEach(function(constraintType){
         var aconstraint = engine.constraintIndex[constraintType];
         aconstraint.satisfied[entity1]=true;
         aconstraint.satisfied[entity2]=true;
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
        var consistent = {};
        var constrainedNodes={}
        var satisfied={}
        engine.constraintIndex[constraintType]={
          satisfied,
          constrainedNodes,
          consistent
        };
        var constraint = constraintTypes[constraintType];
        var sets = Object.keys(constraint);
        var set1 = Object.keys(constraint[sets[0]]);
        var set2 = Object.keys(constraint[sets[1]]);
        cartesian([set1,set2]).forEach(function(pair){
          consistent[pair[0]+":"+pair[1]]=true;
          consistent[pair[1]+":"+pair[0]]=true;
          constrainedNodes[pair[0]]=true;
          constrainedNodes[pair[1]]=true;
        })
      })
      this.reset();

    }
  };

  engine.init();

  return engine;
}

module.exports = { compile };
