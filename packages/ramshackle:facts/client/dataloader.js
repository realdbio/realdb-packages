/**
 * Created by dd on 11/7/14.
 */
Template.tsvTextArea.events({'change keyup': function (event, template) {
    event.preventDefault();

    if (Meteor.user() == null || Meteor.user()._id == null) {
        console.log("User must be logged in");
        return;
    }

    var textarea = template.find("textarea");

    console.log("textarea=" + textarea);

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

//    instance.on('searchingDone', function (searchingIsDone) {
//        console.log('I am done!');
//    });

    instance.on('currentValue', function (val) {
        console.log('The user searches for ' + val);
        typeSearchBoxUserQuery = val;
    });
};

Template.typeChooserCreator.helpers({
    newTypeName: function() {
        return typeSearchBoxUserQuery;
    }
});