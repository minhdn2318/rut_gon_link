const config = {
  mongodb: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener',
    databaseName: 'url-shortener',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
};

module.exports = config;