EasySearch.createSearchIndex('entities', {
    'collection'    : Entities,              // instanceof Meteor.Collection
    'field'         : ['name', 'description'],    // can also be an array of fields
//    'limit'         : 20,                   // default: 10
    'convertNumbers': true,
    'use'           : 'mongo-db',
    'sort'          : function () {
        return { 'name' : -1 };
    }
});

EasySearch.createSearchIndex('types', {
    'collection'    : Types,              // instanceof Meteor.Collection
    'field'         : ['name', 'description'],    // can also be an array of fields
//    'limit'         : 20,                   // default: 10
    'convertNumbers': true,
    'use'           : 'mongo-db',
    'sort'          : function () {
        return { 'name' : -1 };
    }
});

