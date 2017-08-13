
var cartesian = require('cartesian-product');

var compile = function(constraints={}){
  var engine = {
    constraints,
    constraintIndex: {},
    getConstraintTypes: function() {
      return Object.keys(this.constraintIndex)},
    getConsistencyCheck: function(node1,node2){
      // var answer = false;
      //   Object.keys(engine.constraintIndex).forEach(function(constraintType){
      //     var aconstraint = engine.constraintIndex[constraintType];
      //     if(!aconstraint.constrainedNodes[node1]&&!aconstraint.constrainedNodes[node2] ){
      //       answer=true;
      //     } else {
      //       var exist = aconstraint.consistent[node1+":"+node2]
      //       if(exist)
      //         answer=true;  
      //     }          
      //   })
      //   return answer;
      var answer = {
        consistent: true,
        failedconstraints: []
      }
        Object.keys(engine.constraintIndex).forEach(function(constraintType){
          var aconstraint = engine.constraintIndex[constraintType];
          if(!aconstraint.constrainedNodes[node1]&&!aconstraint.constrainedNodes[node2] ){            
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
        engine.constraintIndex[constraintType]={
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
    }
  };

  engine.init();

  return engine;
}

module.exports = { compile };
