
Meteor.subscribe("entities");

Template.formEntityInsert.events({'submit form': function (event, template) {
    event.preventDefault();

    if (Meteor.user() == null || Meteor.user()._id == null) {
        return;
    }

    _name = template.find("input[name=name]");
    _description = template.find("input[name=description]");

    // Do form validation

    var ent = {
        name: _name.value,
        description: _description.value,
        creator: Meteor.user()._id
    };


    Entities.insert(ent, function (err) {
        if (err) {
            console.log("Error inserting entity: " + err)
        }
    });

}});


//Template.listMyEntities.helpers({
//    listMyEntities: function(){
//        return Entities.find({creator: Meteor.user()._id});
//    }
//});

Template.listEntities.helpers({
    entities: function(){
        return Entities.find().fetch();
    }
});

