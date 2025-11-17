import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './shared/api/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        url: configService.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },

        //Tự động đăng ký entities
        autoLoadEntities: true,

        // Tự động đồng bộ hóa schema (chỉ dùng cho development)
        // Đặt là false ở production
        synchronize: configService.get<string>('NODE_ENV') !== 'production',

        // (Tùy chọn) Bật logging để xem các câu lệnh SQL
        logging: false,
      }),
    }),

    UsersModule,

    AuthModule,

    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
