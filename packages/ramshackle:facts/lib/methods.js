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

    lookupMappings: function(info) {

    }


});