module.exports = {
  async up(db, client) {
    // Create collection 'url' with schema validation
    await db.createCollection('urls', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['shortCode', 'originalUrl', 'clicks'],
          properties: {
            shortCode: {
              bsonType: 'string',
              description: 'must be a string and is required',
            },
            originalUrl: {
              bsonType: 'string',
              description: 'must be a string and is required',
            },
            clicks: {
              bsonType: 'int',
              minimum: 0,
              description: 'must be an integer >= 0 and is required',
            },
            createdAt: {
              bsonType: 'date',
              description: 'must be a date',
            },
            updatedAt: {
              bsonType: 'date',
              description: 'must be a date',
            },
          },
        },
      },
    });

    // Create index for shortCode
    await db.collection('urls').createIndex({ shortCode: 1 }, { unique: true });

    // Add sample data
    await db.collection('urls').insertOne({
      shortCode: 'test123',
      originalUrl: 'https://example.com',
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async down(db, client) {
    // Rollback: Delete collection 'urls'
    await db.collection('urls').drop();
  },
};