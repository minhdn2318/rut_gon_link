module.exports = {
  async up(db, client) {
    // Tạo collection 'links' với schema validation
    await db.createCollection('links', {
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

    // Tạo index cho shortCode để đảm bảo uniqueness
    await db.collection('links').createIndex({ shortCode: 1 }, { unique: true });

    // Thêm dữ liệu mẫu (tùy chọn)
    await db.collection('links').insertOne({
      shortCode: 'test123',
      originalUrl: 'https://example.com',
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async down(db, client) {
    // Rollback: Xóa collection 'links'
    await db.collection('links').drop();
  },
};