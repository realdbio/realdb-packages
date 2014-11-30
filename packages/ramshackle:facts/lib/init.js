
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

EasySearch.createSearchIndex('predicates', {
    'collection'    : Predicates,              // instanceof Meteor.Collection
    'field'         : ['name', 'description'],    // can also be an array of fields
//    'limit'         : 20,                   // default: 10
    'convertNumbers': true,
    'use'           : 'mongo-db',
    'sort'          : function () {
        return { 'name' : -1 };
    }
//    'props' : {
//        'filterByTypes' : []
//    },
//    'query' : function (searchString) {
//        // Default query that will be used for searching
//        var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);
//
//        // filter for categories if set
//        if (this.filterByTypes.length > 0) {
//            query.type = { $in : this.filterByTypes };
//        }
//
//        return query;
//    }
});