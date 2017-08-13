# A module which provides a constraints engine

## Terms

Constraint: A Constraint is an entity with 2 related domains of Constrained Entities.  The Constraint expresses which Entities are consistent with each other.

Constrained Entity: An entity that is related to a Constraint.

Consistency: Entities are consistent if
 - there are no constraints involving both Entities
 - there are no Constraints containing one Constrained Entity and not the other
 - all Constraints allow both nodes to coexist

Inconsistency: Entities are in consistent if
  - there is one constraints in which either entity is exists but not the other entity.

![alt text][logo]

[logo]: images/constraints.png "Constraints"

~~~
The UFB Available constraint expresses
the Auckland and Christchurch locations are UFB available sites and
that Fixed Access and Site Mobile Access  depend upon a location which is UFB available.
~~~


## How to use

Define some constraints as an array of relationships from Constraint to Constrained Entity.

Each object in the array represents a link from the Constraint (source) to the Constrained Entity (target)
The source is always the Constraint
~~~
var singleConstraint = [
  {
    source: "Constraint Id",
    sourcename: "Constraint Name",
    target: "Constrainee Reference",
    type: "Association"
  },
  {
    source: "Constraint Id",
    sourcename: "Constraint Name",
    target: "Constrainer id",
    type: "Dependency"
  }
]
~~~

Build the constraint engine passing the constraint data array.
~~~
var constraintEngine = constraints.compile(singleConstraint);
~~~

Then it is possible to query if nodes are consistent according to the constraints.
~~~
var consistencyCheck = constraintEngine.getConsistent("Entity1","Entity2").
~~~


###  Internals
