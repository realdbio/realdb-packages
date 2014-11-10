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
    }


});