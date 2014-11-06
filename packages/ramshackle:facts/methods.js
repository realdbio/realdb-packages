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

    deleteTask: function (taskId) {
        Tasks.remove(taskId);
    },
    setChecked: function (taskId, setChecked) {
        Tasks.update(taskId, { $set: { checked: setChecked} });
    }
});