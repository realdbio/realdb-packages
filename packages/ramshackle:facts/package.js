Package.describe({
  name: 'ramshackle:facts',
  summary: 'defines Fact schema and functions for working with facts',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('0.9.4');
  api.use(
      ['mongo', 'aldeed:collection2', 'accounts-base'],
      ['client', 'server']
  );

    api.use(
        ['templating', 'nemo64:bootstrap', 'less'],
        ['client']
    );


    api.addFiles(
        ['ramshackle:facts.js'],
        ['client', 'server']
    );

    api.addFiles(
        ['views/entity.html', 'views/entity-client.js'],
        ['client']
    );

    api.addFiles(
        ['views/entity-server.js'],
        ['server']
    );

//    api.addFiles(
//        ['ramshackle:facts.js', 'views/entity.js'],
//        ['server']);

    api.export(['Units', 'Entities', 'Predicates'
        , 'Measures', 'Source', 'Fact', 'Vote']
    );
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('aldeed:collection2');
  api.use('ramshackle:facts');
  api.addFiles('ramshackle:facts-tests.js');
});
