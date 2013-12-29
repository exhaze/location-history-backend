var config = require('./config');

if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize-postgres').sequelize
    , postgres = require('sequelize-postgres').postgres
    , sequelize = null

  // the application is executed on the local machine ... use mysql
  sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    omitNull: true,
    logging: config.db.logging,

    pool: { 
      maxConnections: config.db.connections, 
      maxIdleTime: config.db.maxIdleTime 
    },

    define: {
      underscored: true,
      syncOnAssociation: true
    }
  });

  var requireModel = function(path) {
    return require(__dirname + '/models/' + path)(sequelize, Sequelize);
  }

  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    Locations:      requireModel('locations')
  };
}

module.exports = global.db;
