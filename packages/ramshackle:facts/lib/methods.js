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

    bulkLoad: function(data) {
        //TODO security!  Who is allowed, how many may they load
        console.log("Bulk Loading data: " + JSON.stringify(data));

        //store types
        for (var i in data.types) {
            var obj = data.types[i];
            if (!obj) continue;
            obj.creator = Meteor.userId();
            obj.created = new Date();
            obj.updated = new Date();
            obj.validity = 0;
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
    }
});


