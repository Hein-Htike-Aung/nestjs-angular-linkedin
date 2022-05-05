import { IsCreatorGuard } from './guards/is-creator.guard';
import { AuthModule } from './../auth/auth.module';
import { FeedPostEntity } from './models/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from'@nestjs/common';
import { FeedService } from './services/feed.service';
import { FeedController } from './controllers/feed.controller';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([FeedPostEntity])
  ],
  providers: [FeedService, IsCreatorGuard],
  controllers: [FeedController]
})
export class FeedModule {}
