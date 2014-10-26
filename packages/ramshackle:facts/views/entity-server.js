//SERVER METHODS

Meteor.publish("myEntities", function () {
    if (! Meteor.getUser()) return;
    return Entities.find({ creator: Meteor.getUser()._id });
});

Meteor.publish("entities", function () {
    return Entities.find();
});

//Meteor.publish("insertEntity", function(ent) {
//    Entities.insert(ent, function (err) {
//        if (err) {
//            console.log("Error inserting entity: " + err)
//        }
//    });
//});