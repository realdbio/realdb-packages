//SERVER METHODS

Meteor.publish("myEntities", function () {
    if (! this.userId) return;
    return Entities.find({ creator: this.userId });
});

Meteor.publish("myTypes", function () {
    if (! this.userId) return;
    return Types.find({ creator: this.userId });
});

//Meteor.publish("entities", function () {
//    return Entities.find();
//});

//Meteor.publish("insertEntity", function(ent) {
//    Entities.insert(ent, function (err) {
//        if (err) {
//            console.log("Error inserting entity: " + err)
//        }
//    });
//});