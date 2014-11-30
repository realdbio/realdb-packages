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

    bulkLoad: function(data) {
        //TODO security!  Who is allowed, how many may they load
        console.log("Bulk Loading data: " + JSON.stringify(data));

        //store types
        for (var i in data.types) {
            var type = data.types[i];
            if (!type) continue;
            type.creator = Meteor.userId();
            type.created = new Date();
            type.updated = new Date();
            type.validity = 0;
            Types.insert(obj);
        }

        //store entities
        for (var i in data.entities) {
            var obj = data.entities[i];
            if (!obj) continue;
            obj.creator = Meteor.userId();
            obj.created = new Date();
            obj.updated = new Date();
            obj.validity = 0;
            Entities.insert(obj);
        }

        //store facts
        for (var i in data.facts) {
            var obj = data.facts[i];
            if (!obj) continue;
            obj.creator = Meteor.userId();
            obj.created = new Date();
            obj.updated = new Date();
            obj.validity = 0;
            Facts.insert(obj);
        }
    },

    lookupStrategy: function(info) {
        //first see if we have matching Strategy.  If found, return it
        Strategies.find({headersLC: info.headersLC}, function(err, response) {
            if (err) {
                console.log("lookupMappings error: " + err);
            } else {
                console.log("Found strategies: " + JSON.stringify(response));
                if (response.data) {
                    var payload = {
                        strategies: response.data
                    };
                    return payload;
                }
            }

            var strategy = {
                headerMappings: {}
            };
            //Mapping not found:, build a Strategy.

            // Find any matching Mappings
            var q = async.queue(lookupMapping, 5);
            //this will execute when finished
            q.drain = function() {
                console.log('all items have been processed');
                var payload = {
                    strategies: [strategy]
                };
                return payload;
            };

            //start the queue with all headers
            q.push(info.headers, function(err, mapping) {
                if (err) {
                    console.log("lookupMappings error: " + err);
                }
                strategy.headerMappings[mapping.name] = mapping.values;
            });
        });

    }
});


