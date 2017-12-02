# A module which provides a constraints engine

![Build Status](https://travis-ci.org/bayeslife/constraints.svg?branch=master)

![Dependency Status](https://david-dm.org/bayeslife/constraints.svg)

The constraints engine is design to allow the identification of pairs of nodes that satisfy a set of constraints.

A set of choices are defined.
The choices are constrained by constraints.

Choices are selected and the engine is used to identify what are valid remaining choices.

## Terms

Constraint: A Constraint is an entity with 2 set/domains of Constrained Entities.  The Constraint expresses Constrained Entities which are allow with other Constrained Entities.  

Constraint Name: The Constraint has a Constraint Name which names the Constraint.

Constrained Entity: An entity that is constrainted by a Constraint.  A Constrained Entity can be involved in more than one Constraint.

Constraint Relationship: A Constraint expresses a Constraint Relationship.

Directionality: A Constraint Relationship may be unidirectional or bidirectional.  Unidirectional constraints enforce related target entites for source entities.  Bidirectional constraints enforce relationship between one set to the other or vice versa.  Must, Can and OneOf are unidirectional Constraints which Consistent is bidirectionaly.

Solution: A solution involves selecting/capturing Constrained Entities which are consistent with the Constraints.

Selecting: The act of selecing from the set of Constrained Entitoes is referred to as Selecting.  Generally solutions are produced after selecting from options.

Satisfied: A Constraint is satisfied when Constrained Entities are selected/captured which are consistent with the Constraint.

Satisfaction: An Constrained Entity is Satisfied if all Constraints it is involved in are Satisified.  

## Constraint Relationships

### OneOf
The source requires one of the targets.

This is a unidirectional constraint relationship.

```If you choose a happy meal you must select one of a soft drink or bottled water.```
![alt text][OneOf]
[OneOf]: images/OneOf.png "OneOf"

### Must
The source requires the target but the target does not require the source

This is a unidirectional constraint relationship.

```If you select a happy meal you must get the fries```

Note that fries dont mean you get the happy meal.
![alt text][Must]
[Must]: images/Must.png "Must"


### Can
The source does not require the target but targets other than those identified are not allowed

This is a unidirectional constraint relationship.

```A Big Mac can have pickes and/or lettuce but not an extra patty```
![alt text][Can]
[Can]: images/Can.png "Can"


### Consistent:
This is a birectional constraint relationship

Consistency: Entities are consistent if
 - there are no constraints involving both Entities
 - or there are no Constraints containing one and not the other
 - all Constraints allow both nodes to coexist

Inconsistency: Entities are inconsistent if
  - there is one constraints in which either entity is exists but not the other entity.

```A QuarterPounder meal is consistent with a soft drink and (therefore) inconsistent with a thick shake```

![alt text][Consistent]
[Consistent]: images/Consistent.png "Consistent"

## How to use

Define constraints in the JSON form of:
```
var aconstraint = {
  name: constraintOneOfName,
  stereotype: "OneOf",
  source: [
    {
      id: 'id1'
    }
  ],
  target: [
    {
      id: 'id2'      
    },
    {
      id: 'id3'
    }
  ]
}
```
Place any number of these entities in an array.
```
var constraints = [ aconstraint,...]
```

Each object in the array represents a relationship from all source entities to targets.

The stereotype value defines the type of constraint relationship.


Build the constraint engine passing the constraint data array.
~~~
var constraintEngine = constraints.compile(constraints);
~~~

Then it is possible to query if nodes are consistent according to the constraints.
~~~
var consistencyCheck = constraintEngine.getConsistencyCheck("id1","id2").
//returns true
~~~

You can also query if nodes are satisfied.
~~~
constraintEngine.capture("id1","id2").
var satisfiedCheck = constraintEngine.getSatisfied("id1");
//return true
~~~


###  Unit Tests

Run ```npm-watch``` to run the mocha test suite and look at the test.spec.js which has the following output when run successfully.

~~~
[w]   Given a constraint2 engine
[w]     When there is a ONEOF constraint
[w]       √ Then unrelated nodes are consistent
[w]       √ Then src and target are consistent
[w]       √ Then src and second target are consistent
[w]       √ Then src without target is not consistent
[w]
[w]   When there is a OneOf constraint
[w]     and no pair captured
[w]       √ Then the src is not satisifed
[w]       √ And target is satisfied
[w]     and a consistent pair captured
[w]       √ Then the src nodes a satisfied
[w]       √ And the target nodes are satisfied
[w]     and an unconstrained pair captured
[w]       √ Then the src is not satisfied
[w]       √ And the target is satisfied
[w]
[w]   Given a constraint2 engine
[w]     When there is a CANONLY constraint
[w]       √ Then unrelated nodes are consistent
[w]       √ Then src and target are consistent
[w]       √ Then src without target is consistent
[w]
[w]   When there is a CANONLY constraint
[w]     and no pair captured
[w]       √ Then the src is not satisfied but the target is
[w]     and a consistent pair captured
[w]       √ Then the src nodes a satisfied
[w]       √ And the target nodes are satisfied
[w]     and a inconsistent pair captured
[w]       √ Then the src is satisfied
[w]       √ And the target is satisfied
[w]
[w]   Given an explicit constraint2 engine
[w]     When there is a MUST constraint
[w]       √ Then unrelated nodes are consistent
[w]       √ Then constrained nodes are consistent
[w]       √ Then src with unrelated target is consistent
[w]
[w]   When there is a MUST constraint
[w]     and no pair captured
[w]       √ Then the src is not satisfied but the target is
[w]     and a pair captured
[w]       √ Then the src nodes a satisfied
[w]     and a inconsistent pair captured
[w]       √ Then the src is not satisfied
[w]       √ And the target is satisfied
[w]
[w]   Given an explicit constraint2 engine
[w]     When there is a single constraint
[w]       √ Then unconstraint are consistent
[w]       √ Then constrained nodes are consistent
~~~
