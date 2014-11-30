/**
 * Created by dd on 11/7/14.
 */

//subscribe to reactive sources
Meteor.subscribe("entityQueue");
Meteor.subscribe("factQueue");

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
    Session.set("delimiter", delim);
    var headers = headerRow.split(delim);
    console.log("headers=" + headers);
    var cols = [];
//    var existingCols = Session.get("dataColumns");
    var headerStr = "";
    var headerStrLC = "";
    var headersLC = [];
    var ci = 0;
    for (var hi in headers) {
        if (hi==0) continue;
        var headerVal = headers[hi].trim();
        var headerLCVal = headerVal.toLowerCase();
        if (headerStr.length > 0) headerStr += delim;
        headerStr += headerVal;
        if (headerStrLC.length > 0) headerStrLC += "~|~";
        headerStrLC += headerLCVal;
        headersLC.push(headerStrLC);

        var mapping = {
            predIndex: ci,
            predColId: "predCol-" + ci,
            text: headerVal,
            textLC: headerLCVal
        };
        cols.push(mapping);
        ci++;
    }

    Session.set("dataHeaders", headerStr);
    Session.set("dataHeadersLC", headerStrLC);
    Session.set("dataColumns", cols);
//    console.log("cols=" + JSON.stringify(cols));

    if (! Session.get("entityTypeId") || Session.get("entityTypeId")=="newType") return;
    var importInfo = {
        type: Session.get("entityTypeId"),
        headerStr: headerStr,
        headerStrLC: headerStrLC,
        headers: headers,
        headersLC: headersLC
    };

    //look up any mappings
//    Meteor.call("lookupStrategy", importInfo, function(error, result) {
//        if (error) {
//            console.log("error trying to call lookupMappings: " + error);
//            return;
//        }
//
//        if (result.strategies && result.strategies.length > 0) {
//            var strategy = result.strategies[0];
//            Session.set("importStrategy", strategy);
//        }
//
//        for (var ci in cols) {
//            var headerLC = cols[hi].textLC;
//
//            cols[hi].pred = strategy.rowMappings[headerLC];
//        }
//        Session.set("dataColumns", cols);
//
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
        if (!newId) {
            newId = 'newType';
            //TODO filter by type?
//            EasySearch.changeProperty('predicates', 'filterByTypes', null);
        } else {
//            EasySearch.changeProperty('predicates', 'filterByTypes', newId);
        }
        var newName = this.name;
        if (!newName) newName = typeSearchBoxUserQuery;
        Session.set("entityTypeId", newId);
        Session.set("entityTypeName", newName);

        //set EasySearch to filter by this type


//        console.log('click .realdb-type-btn: Session.entityTypeId=' + Session.get("entityTypeId"));
    }
});

var predSearchInstances = [];
var predSearchIndex = 0;
Template.columnMapper.created = function () {
    var instance = EasySearch.getComponentInstance(
        { index : 'predicates' }
    );
//    instance.predSearchIndex = predSearchIndex;
//    predSearchInstances[predSearchIndex] = instance;
    instance.on('searchingDone', function (searchingIsDone) {
        searchingIsDone && console.log('I am done searching!');
    });

    instance.on('currentValue', function (val) {

        console.log('The user searches for ' + val + '; index#=' + predSearchIndex);
        var cols = Session.get("dataColumns");
//        console.log("change #realdbio-columnMapper-predSearch: cols[" + this.predIndex + "]=" + cols[this.predIndex]);
//        this.newPredName = event.currentTarget.value;
    });
};

Template.columnMapper.helpers({
    isVisible: function() {
        if (this.predIndex == predSearchIndex) {
            return "";
        } else {
//            return "hidden";
            return "";
        }
    }
});

Template.columnMapper.events({
//    'currentValue': function(event, template) {
//        console.log('change predSearchInstance #' + this.predIndex);
//    }

    'keyup': function(event, template) {
        var elementId = event.currentTarget.id;
        var predIndex = -1;
        if (elementId.indexOf("predCol-")==0) {
            predIndex = elementId.substring(8);
        }
        var inputVal = event.currentTarget.value;
        console.log('change predIndex #' + predIndex + "=" + inputVal);

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


Template.dataQueue.helpers({
    dataQueueItems: function() {
        return [{title: "Item #1"}, {title: "Another item"}];
    }
});