//Meteor.startup(function () {
//    Meteor.subscribe('myEntities');
//    Meteor.subscribe('myTypes');
//});

Meteor.subscribe('myEntities');
Meteor.subscribe('myTypes');

Handlebars.registerHelper('session',function(input){
    return Session.get(input);
});