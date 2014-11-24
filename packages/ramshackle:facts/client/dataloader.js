/**
 * Created by dd on 11/7/14.
 */
Template.dataLoader.helpers({
    importButtonClass: function() {
        if (Session.get("entityTypeId")
            && Session.get("dataTextAreaContents")
            && Session.get("datesSpecified") ) {
            return "btn-success";
        }
        return "btn-default disabled";
    }
});

Template.dataLoader.events({
   "click #importButton": function() {
       var importStrategy = {
           delimiter: Session.get("delimiter"),
           dataHeadersLC: Session.get("dataHeadersLC"),
           dataHeaders: Session.get("dataHeaders"),
           entityTypeId: Session.get("entityTypeId"),
           entityTypeName: Session.get("entityTypeName"),
//           dataTextAreaContents: Session.get("dataTextAreaContents"),
           dataColumns: Session.get("dataColumns"),
           beginningOfTime: Session.get("beginningOfTime"),
           startDate: Session.get("startDate"),
           eternity: Session.get("eternity"),
           endDate: Session.get("endDate")
       }
       console.log("importStrategy=" + JSON.stringify(importStrategy));

       var importer = new RealdbioImporter(importStrategy);
       importer.import(Session.get("dataTextAreaContents"));
   }
});

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

    var cols = [];
    var existingCols = Session.get("dataColumns");
    var headerStr = "";
    var headerStrLC = "";
    for (var headerIndex in headers) {
        var headerVal = headers[headerIndex].trim();
        if (headerStr.length > 0) headerStr += delim;
        headerStr += headerVal;
        if (headerStrLC.length > 0) headerStrLC += "~|~";
        headerStrLC += headerVal.toLowerCase();
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
    Session.set("dataHeaders", headerStr);
    Session.set("dataHeadersLC", headerStrLC);
    Session.set("dataColumns", cols);
    Session.set("delimiter", delim);
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
        Session.set("entityTypeId", null);
        Session.set("entityTypeName", null);
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
//        console.log("typeButtonClass(): entityTypeId=" + Session.get("entityTypeId") + "; this._id=" + this._id);
        if (this._id && Session.get("entityTypeId") == this._id) return "btn-success";
        if (!this._id && Session.get("entityTypeId") == "newType") return "btn-success";
        return "";
    },

    getIconForType: function(event) {
//        console.log("getIconForType: entityTypeId=" + Session.get("entityTypeId") + "; this._id=" + this._id);
        if (this._id && Session.get("entityTypeId") == this._id) return "ok";
        if (!this._id && Session.get("entityTypeId") == "newType") return "ok";
        return "unchecked"
    },

    typeChooserFinishedIcon: function(event) {
//        console.log("typeChooserFinishedIcon() called");
        if (Session.get("entityTypeId")) {
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
//        console.log('click .realdb-type-btn: entityTypeId=' + Session.get("entityTypeId"));
        var newId = this._id;
        if (!newId) newId = 'newType';
        var newName = this.name;
        if (!newName) newName = typeSearchBoxUserQuery;
        Session.set("entityTypeId", newId);
        Session.set("entityTypeName", newName);
//        console.log('click .realdb-type-btn: Session.entityTypeId=' + Session.get("entityTypeId"));
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
//        console.log("this.header=" + this.header);
//        this.colType = event.currentTarget.value;
//        Session.set("colType_" + this.colIndex, event.currentTarget.value);
//        console.log("set colType_" + this.colIndex + " to " + Session.get("colType_" + this.colIndex));
        var cols = Session.get("dataColumns");
        cols[this.colIndex].colType = event.currentTarget.value;
        Session.set("dataColumns", cols);
    }
});


Template.datePickers.rendered = function() {
    $('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-DD HH:MM:SS'
    })

//        .on('changeDate', function(ev){
//            console.log("Date changed!: " + ev);
//        });
};

Template.datePickers.events({
    "change": function(event) {
        var changedElementId = event.currentTarget.id;

        if ("startDate" == changedElementId) {
            var val = $('#startDate').data("DateTimePicker").getDate();
            Session.set("startDate", new Date(val));
        }

        if ("endDate" == changedElementId) {
            var val = $('#endDate').data("DateTimePicker").getDate();
            Session.set("endDate", new Date(val));
        }

        var val = event.currentTarget.checked;

        if ("beginningOfTime" == changedElementId) {
            Session.set("beginningOfTime", val);
            if (val) {
                $('#startDate').data("DateTimePicker").disable();
            } else {
                $('#startDate').data("DateTimePicker").enable();
            }
        }

        if ("eternity" == changedElementId) {
            Session.set("eternity", val);
            if (val) {
                $('#endDate').data("DateTimePicker").disable();
            } else {
                $('#endDate').data("DateTimePicker").enable();
            }
        }

        var startDateSpecified = Session.get("beginningOfTime") || Session.get("startDate");
        var endDateSpecified = Session.get("eternity") || Session.get("endDate");
        Session.set("datesSpecified", startDateSpecified && endDateSpecified);
    }

//    "changeDate": function(event) {
//        var changedElementId = event.currentTarget.id;
//        console.log("Date changed: " + changedElementId);
//        console.log(changedElementId + "=" + event.date);
//    }
});