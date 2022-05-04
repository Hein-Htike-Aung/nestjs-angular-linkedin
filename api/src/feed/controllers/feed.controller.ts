import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { FeedService } from '../services/feed.service';
import { FeedPost } from './../models/post.interface';

@Controller('feed')
export class FeedController {

    constructor(private feedService: FeedService) { }

    @Post()
    create(@Body() feedPost: FeedPost): Observable<FeedPost> {
        return this.feedService.createPost(feedPost);
    }

    @Get()
    findAll(): Observable<FeedPost[]> {
        return this.feedService.findAllPosts();
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() feedPost: FeedPost): Observable<UpdateResult> {
        return this.feedService.update(id, feedPost);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Observable<DeleteResult> {
        return this.feedService.delete(id);
    }
}
