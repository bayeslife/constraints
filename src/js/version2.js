
var cartesian = require('cartesian-product');

var compile2 = function(constraints,options={explicit: false }){
  var engine = {
    options,
    constraints,
    satisfied: {},

    getConstraintTypes: function() {
      return constraints.map(function(constraint){
        return constraint.name
      })
    },
    applicableConstraint: function(node1,constraint){
      var f = constraint.source.find(function(n){
        return n.id==node1;
      })      
      if(f!=null)  return true;
      var f = constraint.target.find(function(n){
        return n.id==node1;
      })      
      return f!=null
    },
    getConstraintConsistencyCheck: function(node1,node2,constraint,explicit){
      var c = constraint.pairs[node1+":"+node2]!=null?true: false;  
      var a = this.applicableConstraint(node1,constraint);
      if(constraint.stereotype=='Consistent'){
        a = a || this.applicableConstraint(node2,constraint); 
      }      
      if(constraint.stereotype==='Must'){
        return c ? true : null;
      }else if(constraint.stereotype==='CanOnly'){
        return c ? true : (a ? false : null);
      }else if(constraint.stereotype==='OneOf'){
        return c ? true : null;
      }else if(constraint.stereotype==='Consistent'){
        if(!a)
          return null;
        return c ? true : explicit ? false : null;
      }
      else
        return explicit ? false : true
    },
    getConsistencyCheck: function(node1,node2){
      var engine = this;
        var answer = {
          consistent: true,
          failedconstraints: []
        }
        constraints.forEach(function(constraint){
          var check = engine.getConstraintConsistencyCheck(node1,node2,constraint,engine.options.explicit);
          if(check==false){
            answer.consistent = false;
            answer.failedconstraints.push(constraint.name);
          }                            
        })
        return answer;
    },
    getSatisfied: function(entity){
      //All MUST constraints have the targets satisifed
      //When explicit all CAN must not have extra targets
      //OneOf
      //Consistent -        
      var answer = { result: true, unsatisifiedConstraints: [] };      
      var sat = this.satisfied;
      constraints.forEach(function(constraint){
        var validateTarget = false;
        constraint.source.forEach(function(src){
          if(src.id===entity)
            validateTarget=true;
        })
        if(constraint.stereotype==='Consistent'){//Bidirectional
          constraint.target.forEach(function(tgt){
            if(tgt.id===entity)
              validateTarget=true;
          })
        }        
        if(validateTarget && constraint.stereotype==='Must'){
          constraint.target.forEach(function(tgt){
            var s = sat[constraint.name];
            if(!s.musts[tgt.id]){
              answer.result=false;
              answer.unsatisifiedConstraints.push(constraint.name +": Must have "+tgt.name)
            }
          })
        }
        else if(validateTarget && constraint.stereotype==='CanOnly'){
          var s = sat[constraint.name];
          s.cannots.forEach(function(entity){
            answer.result=false;
            answer.unsatisifiedConstraints.push(constraint.name +": Cant have "+entity)
          })
        }
        else if(validateTarget && constraint.stereotype==='OneOf'){
          var s = sat[constraint.name];
          var cnt=0;
          var keys = Object.keys(s.oneofs);
          keys.forEach(function(key){
            if(s.oneofs[key]){
              cnt++
            }
          })
          if(cnt==0){
            answer.result=false;
            answer.unsatisifiedConstraints.push(constraint.name +": OneOf doesnt have required target")
          }else if(cnt>1){
            answer.result=false;
            answer.unsatisifiedConstraints.push(constraint.name +": OneOf has more than one of the required target")
          }
        }
        else if(validateTarget && constraint.stereotype==='Consistent'){
          var s = sat[constraint.name];
          var inconsistencies = s.consistents.filter(function(capture){
            return !capture.consistent;
          })
                    
          if(inconsistencies.length>0){
            answer.result = false;
            answer.unsatisifiedConstraints.push(constraint.name +": Inconsistencies captured")
          }
          var consistencies = s.consistents.filter(function(capture){
            return capture.consistent && (capture.src==entity || capture.tgt===entity);
          })
          if(consistencies==0){
            answer.result = false;
            answer.unsatisifiedConstraints.push(constraint.name+": No selection captured")
          }        
        }        
      })
      return answer;
    },
    reset: function(){
      var sat = this.satisfied={};
      constraints.forEach(function(constraint){
        var musts = {};
        var cannots = [];
        var oneofs = {};
        var consistents= [];
        sat[constraint.name]={musts: musts, cannots: cannots,oneofs: oneofs, consistents: consistents};
        if(constraint.stereotype==='Must'){
          constraint.target.forEach(function(tgt){
            musts[tgt.id]=false;
          })
        }
        else if(constraint.stereotype==='OneOf'){
          constraint.target.forEach(function(tgt){
            oneofs[tgt.id]=false;
          })
        }
        else if(constraint.stereotype==='Consistent'){
        }
      })
    },

    capture: function(entity1,entity2){
      var answer = false;
      var engine = this;
      var sat =this.satisfied;
      constraints.forEach(function(constraint){
        if(constraint.stereotype==='Must'){
          var check =engine.getConstraintConsistencyCheck(entity1,entity2,constraint);
          if(check==true){
            sat[constraint.name].musts[entity2]=true
          }
        }
        else if(constraint.stereotype==='OneOf'){
          var check = engine.getConstraintConsistencyCheck(entity1,entity2,constraint,true);
          if(check==true){
            sat[constraint.name].oneofs[entity2]=true
          }
        }
        else if(constraint.stereotype==='CanOnly'){
          var check = engine.getConstraintConsistencyCheck(entity1,entity2,constraint);
          if(check==false){
            sat[constraint.name].cannots.push(entity2)
          }
        }
        else if(constraint.stereotype==='Consistent'){
          var check = engine.getConstraintConsistencyCheck(entity1,entity2,constraint,options.explicit);
          if(check!=null)
            sat[constraint.name].consistents.push({src: entity1,tgt: entity2,consistent: check})        
        }
      })
      return answer;
    },

    init: function(){      
      constraints.forEach(function(constraint){
        if(!constraint.pairs)
          constraint.pairs={}
        var srcs = constraint.source.map(function(source){
          return source.id;
        })
        var tgts = constraint.target.map(function(target){
          return target.id;
        })        
        cartesian([srcs,tgts]).forEach(function(pair){
          constraint.pairs[pair[0]+":"+pair[1]]=true;
          if(constraint.stereotype==='Consistent'){//Bidirectional
            constraint.pairs[pair[1]+":"+pair[0]]=true;
          }
        })        
      })
      this.reset();
    }
  };

  engine.init();

  return engine;
}

module.exports = { compile2 };