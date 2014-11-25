/**
 * Created by dd on 11/23/14.
 */
RealdbioImporter = function(config) {
    var self = this;
    self.config = config;

};

/** import CSV/TSV/PSV/SSV data */
RealdbioImporter.prototype.import = function(data) {
    var self = this;
    var lines = data.split("\n");
    var entities = [];
    var facts = [];

    var typeObjId = self.config.entityTypeId;
    if (typeObjId == "newType") typeObjId = null;
    if (! typeObjId) typeObjId = new Meteor.Collection.ObjectID();
    var typeObj = {
        _id: typeObjId,
        name: self.config.entityTypeName
    };
    for (var li in lines) {
        var line = lines[li].trim();
        if (! line) continue;
        var cells = line.split(self.config.delimiter);
        if (!cells || cells.length == 0) continue;

        var entity = entities[li];
        if (! entity) {
            entity = {
                _id: new Meteor.Collection.ObjectID(),
                type: typeObj._id
            };
            entities.push(entity);

            //if facts already exist for this row, then update them with the new id
//                if (theFacts) {
//                    for (var fi in theFacts) {
//                        var fact = theFacts[fi];
//                        fact.subj = entity._id
//                    }
//                }
        }

        for (var ci in cells) {
            var colType = self.config.dataColumns[ci].colType;
            var header = self.config.dataColumns[ci].header;
            if (colType=="ignore") continue;
            var cell = cells[ci];
            if (!cell) continue;

            if (! facts[ci]) facts[ci] = [];
//            var theFacts = facts[ci];


            if (colType=="title") {
                entity.title = cell;
                entities[li] = entity;
            } else if (colType=="description" || colType=="synonym") {
                var description = entity.description || "";
                if (description && description.length > 0) description += "; ";
                description += cell;
                entity.description = description;
                entities[li] = entity;
            } else if (colType=="datum") {
                var numericVal = null;
                if(isNumber(cell)) {
                    numericVal = cell;
                }
                var fact = {
                    subj: entity._id,
                    header: header,
//                    pred: header,
                    text: cell,
                    num: numericVal
                };
                facts[ci].push(fact);
            }
        }
    }

    var bulkData = {
        types: [typeObj],
        entities: entities,
        facts: facts,
        strategies: [self.config]
    };

    console.log("bulkData=" + JSON.stringify(bulkData, "  "));
    //store entities and facts
    Meteor.call("bulkLoad", bulkData, function(error, result) {
        // display the error to the user and abort
        if (error)
            return console.log("Error calling bulkLoad: " + error.reason);
        console.log("bulkLoad returns: " + result);
    });
};