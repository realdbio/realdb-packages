
Meteor.subscribe("entities");

Template.formEntityInsert.events({'submit form': function (event, template) {
    event.preventDefault();

    if (Meteor.user() == null || Meteor.user()._id == null) {
        return;
    }

    _name = template.find("input[name=name]");
    _description = template.find("input[name=description]");

    var ent = {
        name: _name.value,
        description: _description.value,
        creator: Meteor.user()._id
    };

    var validationError = false;

//    if (! Entities.simpleSchema().namedContext().validateOne(ent, "name")) {
//        Session.set("error-readlbio-entity-name", "Please enter a name");
//        validationError = true;
//    } else {
//        Session.set("error-readlbio-entity-name"
//    }

    if (! Entities.simpleSchema().namedContext().validateOne(ent, "description")) {
        Session.set("error-readlbio-entity-name", "Please enter a name");
        validationError = true;
    }

    if (validationError) return;

    Entities.insert(ent, function (err) {
        if (err) {
            console.log("Error inserting entity: " + err);
            Session.set("error-readlbio-entity", "Unable to insert. Please fix your input.");
            validationError = true;
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

Template.listEntities.rendered = function(){
    if (!this.rendered) {
        //initialize popup
        $('.realdb-btn-entity-info').popup();
        this.rendered = true;
    }
};



Template.listEntities.events({
    'click .realdb-btn-entity-info': function(event){
//        console.log(event.target);
//        event.target.popup();
        event.currentTarget.popup({
            title: this.name,
            content: this.description,
            on: 'focus'
        });
    }
});

