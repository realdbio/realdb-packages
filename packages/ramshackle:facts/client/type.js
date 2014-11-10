Template.formTypeInsert.events({'submit form': function (event, template) {
    event.preventDefault();
    if (Meteor.user() == null || Meteor.user()._id == null) {
        return;
    }
    _name = template.find("input[name=name]");
    _description = template.find("input[name=description]");
    var obj = {
        name: _name.value,
        description: _description.value,
        creator: Meteor.user()._id
    };
    var validationError = false;
    if (! Types.simpleSchema().namedContext().validateOne(obj, "description")) {
        Session.set("error-readlbio-entity-name", "Please enter a name");
        validationError = true;
    }
    if (validationError) return;
    Meteor.call("addType", obj, function(error, result) {
        // display the error to the user and abort
        if (error)
            return alert(error.reason);
        console.log("addType returns: " + result);
    });
}});


Template.listMyTypes.helpers({
    types: function(){
        return Types.find().fetch();
    }
});