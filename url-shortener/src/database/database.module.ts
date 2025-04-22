import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { getConfig } from '../common/config/configuration';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = getConfig(configService);
        return {
          uri: config.database.uri,
          // Enable sharding if configured
          ...(config.database.sharding ? {} : {}),
          // ...(config.database.sharding ? { shardKey: { shortCode: 1 } } : {}),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}