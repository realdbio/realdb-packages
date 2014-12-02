//SERVER METHODS

Meteor.publish("myEntities", function () {
    if (! this.userId) return;
    return Entities.find({ creator: this.userId });
});

Meteor.publish("myTypes", function () {
    if (! this.userId) return;
    return Types.find({ creator: this.userId });
});

Meteor.publish("typeQueue", function () {
    if (! this.userId) return;
    return Types.find({ creator: this.userId, validity: {$lte: 0} });
});

Meteor.publish("entityQueue", function () {
    if (! this.userId) return;
    return Entities.find({ creator: this.userId, validity: {$lte: 0} });
});

Meteor.publish("factQueue", function () {
    if (! this.userId) return;
    return Facts.find({ creator: this.userId, validity: {$lte: 0} });
});

Meteor.publish("predicateQueue", function () {
    if (! this.userId) return;
    return Predicates.find({ creator: this.userId, validity: {$lte: 0} });
});

lookupHeaderMapping = function(info, callback) {
    Mappings.find({textLC: info.textLC, mapType: "Predicate"}, function(err, result) {
        if (err) {
            console.log("Error in lookupHeaderMapping: " + err);
            callback(err);
        }
        callback(null, result);
    });
};

lookupRowMapping = function(info, callback) {
    Mappings.find({textLC: info.textLC, mapType: "Entity"}, function(err, result) {
        if (err) {
            console.log("Error in lookupRowMapping: " + err);
            callback(err);
        }
        callback(null, result);
    });
};
