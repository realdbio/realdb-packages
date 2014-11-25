//define schema for facts and related classes

Units = new Mongo.Collection("units");
Measures = new Mongo.Collection("measures");
Entities = new Mongo.Collection("entities");
Types = new Mongo.Collection("types");
Predicates = new Mongo.Collection("predicates");
Sources = new Mongo.Collection("sources");
Facts = new Mongo.Collection("facts");
Votes = new Mongo.Collection("votes");
Lists = new Mongo.Collection("lists");
//Items = new Mongo.Collection("items");

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
    description: { type: String, label: "Description", optional: true }, //the description
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    validity: { type: Number, defaultValue: 0, index: 1 }, //the validity score
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 }
});
Types.attachSchema(Schemas.Type);

Schemas.Entity = new SimpleSchema({
    name: { type: String, label: "Name" }, //the canonical name
    description: { type: String, label: "Description", optional: true }, //the description
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    validity: { type: Number, defaultValue: 0, index: 1 }, //the validity score
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 }
});
Entities.attachSchema(Schemas.Entity);

Schemas.Predicate = new SimpleSchema({
    name: { type: String, label: "Name" }, //the canonical name
    description: { type: String, optional: true, label: "Description" }, //the description
    measure: { type: Schemas.Measure, optional: true }, //the type of measure, if any
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    validity: { type: Number, defaultValue: 0, index: 1 }, //the validity score
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true, index: 1 },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 }
});
Predicates.attachSchema(Schemas.Predicate);

Schemas.Source = new SimpleSchema({
    name: { type: String, label: "Name" }, //the canonical name
    description: { type: String, label: "Description" }, //the description
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    validity: { type: Number, defaultValue: 0, index: 1 }, //the validity score
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 }
});
Sources.attachSchema(Schemas.Source);

Schemas.Fact = new SimpleSchema({
    subj: { type: Schemas.Entity, index: 1 }, //the subject
    header: { type: String, index: 1 }, //the header before mapping to a predicate id
    pred: { type: Schemas.Predicate, index: 1 } , //the predicate
    obj: { type: Schemas.Entity, optional: true, index: 1 }, //the object
    type: { type: Schemas.Type, optional: true, index: 1 }, //the type of entity
    text: { type: String }, //the string value
    num: { type: Number, optional: true }, //the numeric value
    unit: { type: Schemas.Unit, optional: true }, //the unit of measure for this fact
    mes: { type: Schemas.Measure, optional: true }, //the type of measurement,
    norm: { type: Number, optional: true }, //the normalized value (normalized to the canonical unit for that measure
    nunt: { type: Schemas.Unit, optional: true }, //the canonical unit for that normalized measure
    sdt: { type: Date, optional: true, index: -1 }, //the start date.  if null, it means since the begin of time
    edt: { type: Date, optional: true, index: -1 }, //the end date.  if null, it means forever
    src: { type: String }, //the data source that this fact came in,
    tvotes: { type: Number, optional: true }, //number of votes that this is true
    fvotes: { type: Number, optional: true }, //number of votes that this is false
    truth: { type: Number, optional: true, defaultValue: 1.0, index: 1 }, //an estimation of the truth, 0-1, that is computed and updated, based on credentials of those who voted
    validity: { type: Number, defaultValue: 0, index: 1 }, //the validity score of the data
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 }

});
Facts.attachSchema(Schemas.Fact);

Schemas.Vote = new SimpleSchema({
    fact: { type: Schemas.Fact, index: 1 }, //the fact that the vote applies to
    type: { type: String, allowedValues: ['TRUE', 'FALSE', 'GOOD', 'BAD'], index: 1 }, //the type: TRUE, FALSE, GOOD, BAD, ...
    text: { type: String, optional: true }, //a text value if any
    num: { type: Number, optional: true, index: 1 }, //the numeric value
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 }
});
Votes.attachSchema(Schemas.Vote);

/**
 * An Item is an item in a List.  It is intended to represent a single entity
 * An Item contains a list of facts (properties + values) associated with that entity.
 * So an item represents an entity with a subset of its fields.
 * @type {SimpleSchema}
 */
Schemas.Item = new SimpleSchema({
    subj: { type: Schemas.Entity, optional: true }, //the subject if there is 1.  Usually there is 1
    type: { type: Schemas.Type, optional: true }, //the type of entity if there is 1.  Usually there is 1
    name: { type: String, label: "Name", optional: true },
    description: { type: String, label: "Description", optional: true }, //the description
    facts: { type: [Schemas.Fact] }
});

/**
 * A List is a list of items.
 * It can be saved from a search in the realdb UI
 * It contains a static list of items.
 * It also contains a map of all Entities referenced (as subjects or as objects) and all Predicates used.
 * It can be regenerated when data changes
 * @type {SimpleSchema}
 */
Schemas.List = new SimpleSchema({
    name: { type: String, label: "Name" },
    description: { type: String, label: "Description" }, //the description
    type: { type: Object }, //the type of items.  key=type id, value=Type object
    entities: { type: Object }, //the entities within the items.  key=entity id, value=Entity object
    properties: { type: Object }, //the predicates within the items.  key=predicate id, value=Predicate object
    items: { type: [Schemas.Item] },//the items within the list
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String },
    version: { type: Number } //the version number
});
Lists.attachSchema(Schemas.List);


