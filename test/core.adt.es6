//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Copyright (C) 2015-2016 Quildreen Motta.
// Licensed under the MIT licence.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { property, forall} = require('jsverify');
const {data, setoid, show} = require('../core/adt/')

describe('Data.ADT.derive', function() {
  describe('Setoid', function() {
    const { A, B } = data('AB', {
      A: (value) => ({ value }),
      B: (value) => ({ value })
    }).derive(setoid)
    
    property('Different simple values are NOT equal', 'json', function(a) {
      return !A(a).equals(B(a))
    });
    property('Different composite values are NOT equal', 'json', function(a) {
      return !A(B(a)).equals(A(a))
    });
    property('Similar simple values are equal', 'json', function(a) {
      return A(a).equals(A(a))
    });
    property('Similar composite values are equal', 'json', function(a) {
      return A(B(a)).equals(A(B(a)))
    });

    describe('Setoid#withEquality', function() {

      const { A } = data('A', {
        A: (value) => ({ value }),
      }).derive(setoid.withEquality((a, b) => a.id === b.id));
      
      property('Values are compared using a custom function if provided', 'json', 'json', function(a, b) {
        return A({id:1, _irrelevantValue:a}).equals(A({id:1, _irrelevantValue: b}))
      });
    });
  });
  describe('Show', function() {
    const AB = data('AB', {
      A: (value) => ({ value }),
      B: (value) => ({ value })
    }).derive(show)

    property('Types have a string representation', function() {
      debugger
      return AB.toString()  === 'AB';
    })

    property('Variants have a string representation', function() {
      return AB.A.toString()  === 'AB.A';
    })
    property('Primitive Values have a string representation', function() {
      return AB.A(1).toString()  === 'AB.A({ value: 1 })';
    })
    property('Complex Values have a string representation', function() {
      return AB.A({foo: "bar"}).toString()  === 'AB.A({ value: { foo: "bar" } })';
    })
    property('Recursive Values have a string representation', function() {
      return AB.A({rec:AB.A(1)}).toString()  ===  'AB.A({ value: { rec: AB.A({ value: 1 }) } })'
    })
  });
});