const config = {
  mongodb: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/link-shortener',
    databaseName: 'link-shortener',
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