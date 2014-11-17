/**
 * Created by dd on 11/7/14.
 */
Template.dataTextArea.events({'keyup': function (event, template) {
    console.log("dataTextArea change keyup");
    event.preventDefault();

//    if (Meteor.user() == null || Meteor.user()._id == null) {
//        console.log("User must be logged in");
//        return;
//    }

    var textarea = template.find("textarea");

//    console.log("textarea=" + textarea.value);

    Session.set("dataTextAreaContents", textarea.value);
    var headerRow = textarea.value.split('\n')[0];
    var delim = ",";
    //if a semicolon is in the first row then it is the delim
    if (headerRow.indexOf(";") >= 0) delim = ";";
    //if a tab is in the first row then it is the delim
    if (headerRow.indexOf("\t") >= 0) delim = "\t";
    Session.set("dataDelimiter", delim);
    var headers = headerRow.split(delim);
    Session.set("dataHeaders", headers);

    var cols = [];
    var existingCols = Session.get("dataColumns");
    for (var headerIndex in headers) {
        var headerVal = headers[headerIndex].trim();
        var colType;
        if (existingCols) colType = existingCols.colType;

        if (! colType) {
            if (headerIndex == 0) {
                colType = "title";
            } else {
                colType = "datum";
            }
        }
//        Session.set("colType_" + headerIndex, colType);
        var headerObj = {
            colIndex: headerIndex,
            header: headerVal,
            colType: colType
        };
//        headerObj[colType] = true;
//        console.log("headerObj=" + headerObj);
//        cols[headerVal] = headerObj;
        cols.push(headerObj);
    }
    Session.set("dataColumns", cols);
//    Meteor.call("addEntity", ent, function(error, result) {
//        // display the error to the user and abort
//        if (error)
//            return alert(error.reason);
//        console.log("addEntity returns: " + result);
//    });

}});

typeSearchBoxUserQuery = "";

Template.typeChooserCreator.created = function () {
    var instance = EasySearch.getComponentInstance(
        { id: 'typeChooser', index: 'types' }
    );

    instance.on('searchingDone', function (searchingIsDone) {
//        console.log('I am done! ' + searchingIsDone);
        Session.set("selectedTypeId", null);
    });

    instance.on('currentValue', function (val) {
//        console.log('The user searches for ' + val);
        typeSearchBoxUserQuery = val;
    });
};

Template.typeChooserCreator.helpers({
    newTypeName: function() {
        return typeSearchBoxUserQuery;
    },

    typeButtonClass: function() {
//        console.log("typeButtonClass(): selectedTypeId=" + Session.get("selectedTypeId") + "; this._id=" + this._id);
        if (this._id && Session.get("selectedTypeId") == this._id) return "btn-success";
        if (!this._id && Session.get("selectedTypeId") == "newType") return "btn-success";
        return "";
    },

    getIconForType: function(event) {
//        console.log("getIconForType: selectedTypeId=" + Session.get("selectedTypeId") + "; this._id=" + this._id);
        if (this._id && Session.get("selectedTypeId") == this._id) return "ok";
        if (!this._id && Session.get("selectedTypeId") == "newType") return "ok";
        return "unchecked"
    },

    typeChooserFinishedIcon: function(event) {
//        console.log("typeChooserFinishedIcon() called");
        if (Session.get("selectedTypeId")) {
            return "btn btn-large btn-success";
        } else {
            return "hidden";
        }

    }
});

Template.typeChooserCreator.events({
    'click .realdb-type-btn': function(event, template) {
        event.preventDefault();
        this.icon="check";
//        console.log('click .realdb-type-btn: selectedTypeId=' + Session.get("selectedTypeId"));
        var newId = this._id;
        if (!newId) newId = 'newType';
        Session.set("selectedTypeId", newId);
        Session.set("selectedTypeName", this.name);
//        console.log('click .realdb-type-btn: Session.selectedTypeId=' + Session.get("selectedTypeId"));
    }
});

Template.columnMapper.helpers({
   isSelected: function(colType) {
//       console.log("colType=" + colType + "; this.colType=" + this.colType);
       if (colType == this.colType) return "selected";
       return "";
   }
});

Template.columnMapper.events({
    'change': function(event) {
        console.log("this.header=" + this.header);
//        this.colType = event.currentTarget.value;
//        Session.set("colType_" + this.colIndex, event.currentTarget.value);
//        console.log("set colType_" + this.colIndex + " to " + Session.get("colType_" + this.colIndex));
        var cols = Session.get("dataColumns");
        cols[this.colIndex].colType = event.currentTarget.value;
        Session.set("dataColumns", cols);
    }
});