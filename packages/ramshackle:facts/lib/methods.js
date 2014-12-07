Meteor.methods({
    addEntity: function (entity) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        entity.created = new Date();
        entity.creator = Meteor.userId();

        Entities.insert(entity);
    },

    addType: function (type) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        type.created = new Date();
        type.creator = Meteor.userId();

        Types.insert(type);
    },

    /**
     * Do this before we load the data.  Prepare the data
     * @param str the raw CSV/TSV/;SV/|SV data
      */
    preLoad: function(str) {

    },

//    bulkLoad: function(data) {
//        //TODO security!  Who is allowed, how many may they load
//        console.log("Bulk Loading data: " + JSON.stringify(data));
//
//        //store types
//        for (var i in data.types) {
//            var obj = data.types[i];
//            if (!obj) continue;
//            obj.creator = Meteor.userId();
//            obj.created = new Date();
//            obj.updated = new Date();
//            obj.validity = 0;
//            Types.insert(obj);
//        }
//
//        //store entities
//        for (var i in data.entities) {
//            var obj = data.entities[i];
//            if (!obj) continue;
//            obj.creator = Meteor.userId();
//            obj.created = new Date();
//            obj.updated = new Date();
//            obj.validity = 0;
//            Entities.insert(obj);
//        }
//
//        //store facts
//        for (var i in data.facts) {
//            var obj = data.facts[i];
//            if (!obj) continue;
//            obj.creator = Meteor.userId();
//            obj.created = new Date();
//            obj.updated = new Date();
//            obj.validity = 0;
//            Facts.insert(obj);
//        }
//    },

    lookupStrategy: function(info) {
        //first see if we have matching Strategy.  If found, return it
        Strategies.find({headersLC: info.headersLC}, function (err, response) {
            if (err) {
                console.log("lookupMappings error: " + err);
                return null;
            } else {
                console.log("Found strategies: " + JSON.stringify(response));
                if (response.data) {
                    var payload = {
                        strategies: response.data
                    };
                    return payload;
                }
            }
        });
    },

    lookupHeaderMappings: function(headers) {
        // Find any matching Mappings
        var q = async.queue(lookupHeaderMapping, 5);
        var mappings = {};
        //this will execute when finished
        q.drain = function() {
            console.log('all headers have been looked up');
            var payload = {
                headerMappings: mappings
            };
            return payload;
        };

        //start the queue with all headers
        q.push(headers, function(err, mapping) {
            if (err) {
                console.log("lookupHeaderMappings error: " + err);
            }
            mappings[mapping.name] = mapping.values;
        });
    },

    lookupRowMappings: function(rows) {
        // Find any matching Mappings
        var q = async.queue(lookupRowMapping, 5);
        var mappings = {};
        //this will execute when finished
        q.drain = function() {
            console.log('all rows have been looked up');
            var payload = {
                rowMappings: mappings
            };
            return payload;
        };

        //start the queue with all headers
        q.push(rows, function(err, mapping) {
            if (err) {
                console.log("lookupRowMappings error: " + err);
            }
            mappings[mapping.name] = mapping.values;
        });
    },

    //TODO run on server only
    importStrategyData: function(payload) {
        var s = payload.strategy;

        //TODO see if this strategy has been stored. If not, store it

        var type = {
            _id: s.entityTypeId,
            name: s.entityTypeName
        };

        //Import Col Mappings
        for (var ci in s.columnMappings) {
            var columnMapping = s.columnMappings[ri];
            var pred;
            if (! columnMapping.entity) {
                //this row has no entity.  continue;
                //TODO in the future, require mappings to be specified
                pred = {
                    _id: new Meteor.Collection.ObjectID(),
                    name: columnMapping.name,
                    nameLC: columnMapping.name.toLowerCase(),
                    updated: new Date(),
                    creator: Meteor.userId()
                };
                Predicates.save(pred);
                columnMapping.entity = pred._id;
            } else {
                pred = Predicates.findOne(columnMapping.pred);
                if (! pred) {
                    pred = {
                        _id: columnMapping.entity,
                        name: columnMapping.name,
                        nameLC: columnMapping.name.toLowerCase(),
                        updated: new Date(),
                        creator: Meteor.userId()
                    };
                    Predicates.save(pred);
                }
            }

            //TODO only store if such a mapping (this name to this entity) does not exist.
            //store the mapping
            columnMapping.mapType = "Entity";
            columnMapping.created = new Date();
            columnMapping.creator = Meteor.userId();
            columnMapping.updated = new Date();
            Mappings.save(columnMapping);
        }







        //Import Row Mappings
        for (var ri in s.rowMappings) {
            var rowMapping = s.rowMappings[ri];
            var subject;
            if (! rowMapping.entity) {
                //this row has no entity.  continue;
                //TODO in the future, require mappings to be specified
                subject = {
                    _id: new Meteor.Collection.ObjectID(),
                    name: rowMapping.name,
                    nameLC: rowMapping.name.toLowerCase(),
                    updated: new Date(),
                    creator: Meteor.userId()
                };
                Entities.save(subject);
                rowMapping.entity = subject._id;
            } else {
                subject = Entities.findOne(rowMapping.entity);
                if (! subject) {
                    subject = {
                        _id: rowMapping.entity,
                        name: rowMapping.name,
                        nameLC: rowMapping.name.toLowerCase(),
                        updated: new Date(),
                        creator: Meteor.userId()
                    };
                    Entities.save(subject);
                }
            }

            //TODO only store if such a mapping (this name to this entity) does not exist.
            //store the mapping
            rowMapping.mapType = "Entity";
            rowMapping.created = new Date();
            rowMapping.creator = Meteor.userId();
            rowMapping.updated = new Date();
            Mappings.save(rowMapping);
        }
    }
});


