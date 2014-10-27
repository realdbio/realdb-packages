//define schema for facts and related classes

Units = new Mongo.Collection("units");
Measures = new Mongo.Collection("measures");
Entities = new Mongo.Collection("entities");
Types = new Mongo.Collection("types");
Predicates = new Mongo.Collection("predicates");
Sources = new Mongo.Collection("sources");
Facts = new Mongo.Collection("facts");
Votes = new Mongo.Collection("votes");

var Schemas = {};

Schemas.Unit = new SimpleSchema({
    name: { type: String }, //the canonical name
    abbrev: { type: String, optional: true }, //the abbreviation
    convert: { type: Number, optional: true } //multiply this a value with the current unit by this value to get its canonical value
});
Units.attachSchema(Schemas.Unit);

Schemas.Measure = new SimpleSchema({
    name: { type: String, label: "Name" }, //the canonical name
    description: { type: String, optional: true, label: "Description" }, //the description
    units: { type: [ Schemas.Unit ] }
});
Measures.attachSchema(Schemas.Measure);

Schemas.Type = new SimpleSchema({
    name: { type: String, label: "Name" }, //the canonical name
    description: { type: String, label: "Description" }, //the description
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String }
});
Types.attachSchema(Schemas.Type);

Schemas.Entity = new SimpleSchema({
    name: { type: String, label: "Name" }, //the canonical name
    description: { type: String, label: "Description" }, //the description
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String }
});
Entities.attachSchema(Schemas.Entity);

Schemas.Predicate = new SimpleSchema({
    name: { type: String, label: "Name" }, //the canonical name
    description: { type: String, optional: true, label: "Description" }, //the description
    measure: { type: Schemas.Measure, optional: true }, //the type of measure, if any
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String }
});
Predicates.attachSchema(Schemas.Predicate);

Schemas.Source = new SimpleSchema({
    name: { type: String, label: "Name" }, //the canonical name
    description: { type: String, label: "Description" }, //the description
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String }
});
Sources.attachSchema(Schemas.Source);

Schemas.Fact = new SimpleSchema({
    subj: { type: Schemas.Entity }, //the subject
    pred: { type: Schemas.Predicate } , //the predicate
    obj: { type: Schemas.Entity, optional: true }, //the object
    text: { type: String }, //the string value
    num: { type: Number, optional: true }, //the numeric value
    unit: { type: Schemas.Unit, optional: true }, //the unit of measure for this fact
    mes: { type: Schemas.Measure, optional: true }, //the type of measurement,
    norm: { type: Number, optional: true }, //the normalized value (normalized to the canonical unit for that measure
    nunt: { type: Schemas.Unit, optional: true }, //the canonical unit for that normalized measure
    sdt: { type: Date, optional: true }, //the start date.  if null, it means since the begin of time
    edt: { type: Date, optional: true }, //the end date.  if null, it means forever
    src: { type: String }, //the data source that this fact came in,
    tvotes: { type: Number, optional: true }, //number of votes that this is true
    fvotes: { type: Number, optional: true }, //number of votes that this is false
    truth: { type: Number, optional: true, defaultValue: 1.0 }, //an estimation of the truth, 0-1, that is computed and updated, based on credentials of those who voted
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String }

});
Facts.attachSchema(Schemas.Fact);

Schemas.Vote = new SimpleSchema({
    fact: { type: Schemas.Fact }, //the fact that the vote applies to
    typ: { type: String, allowedValues: ['TRUE', 'FALSE', 'GOOD', 'BAD'] }, //the type: TRUE, FALSE, GOOD, BAD, ...
    text: { type: String, optional: true }, //a text value if any
    num: { type: Number, optional: true }, //the numeric value
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String }
});
Votes.attachSchema(Schemas.Vote);

