/**
 * Created by dd on 11/7/14.
 */
Template.tsvTextArea.events({'keyup': function (event, template) {
    console.log("tsvTextArea change keyup");
    event.preventDefault();

//    if (Meteor.user() == null || Meteor.user()._id == null) {
//        console.log("User must be logged in");
//        return;
//    }

    var textarea = template.find("textarea");

//    console.log("textarea=" + textarea.value);

    Session.set("tsvTextAreaContents", textarea.value);
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
//        console.log('click .realdb-type-btn: Session.selectedTypeId=' + Session.get("selectedTypeId"));
    }
});