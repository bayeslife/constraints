# A module which provides a constraints engine

## Terms

Constraint: A Constraint is an entity with 2 related domains of Constrained Entities.  The Constraint expresses which Constrained Entities are consistent with each other.
The Constraint has a Constraint Name.

Constrained Entity: An entity that is related to a Constraint.

Constraint Relationship: A Constraint is linked to Constrained Entities through a specific Constraint Relationship.

Consistency: Entities are consistent if
 - there are no constraints involving both Entities
 - there are no Constraints containing one Constrained Entity and not the other
 - all Constraints allow both nodes to coexist

Inconsistency: Entities are inconsistent if
  - there is one constraints in which either entity is exists but not the other entity.

Selecting: The act of identifying a selected Constrained Entity for each of the Constraint Relationships is referred to as Selecting.

Satisfied Constrained Entity: A Constrained Entity is Satisfied when all the Constraints it is associated with have been Selected.

## Example constraints
The diagram belows has a visual representation of constraints.

Semantically the first constraints has the following meaning.
  ~~~
  The UFB Available constraint expresses
  the Auckland and Christchurch locations are UFB available sites and
  that Fixed Access and Site Mobile Access  depend upon a location which is UFB available.
  ~~~

![alt text][logo]

[logo]: images/constraintmodel.png "Constraints"



## How to use

Define some constraints as an array of relationships from Constraint to Constrained Entity.

Each object in the array represents a link from the Constraint (source) to the Constrained Entity (target)

The source is always the Constraint.

The type value is used to split the Constrained Entities into the distinct sets.
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
var consistencyCheck = constraintEngine.getConsistencyCheck("Entity1","Entity2").
~~~


###  Unit Tests

Run ```npm-watch``` to run the mocha test suite and look at the test.spec.js which has the following output when run successfully.

~~~

   Given a constraint engine
     When there is a single constraint
       √ Then there is a single constraint indexed
       √ Then the constrained nodes are consistent
       √ Then the constrainted nodes are consistent the other way around
       √ Then unconstrainted nodes are consistent
       √ Then constrained and unconstrainted nodes are not consistent
     When there is are 2 constraint
       √ Then there is 2 constraints indexed
       √ Then the constrained nodes are consistent
       √ Then the constrainted nodes are consistent the other way around
       √ Then entities which dont satisfy both constraints are inconsistent
     When there is are 3 constraints which make all combinations invalid
       √ Then consistent combinations are identified
       √ Then inconsistent combinations are identified

~~~
