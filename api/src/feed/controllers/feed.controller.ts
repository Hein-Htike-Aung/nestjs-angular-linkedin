import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { FeedService } from '../services/feed.service';
import { FeedPost } from './../models/post.interface';

@Controller('feed')
export class FeedController {

    constructor(private feedService: FeedService) { }

    @Post()
    @UseGuards(JwtGuard)
    create(@Body() feedPost: FeedPost, @Request() req): Observable<FeedPost> {
        return this.feedService.createPost(req.user, feedPost);
    }

    // @Get()
    // findAll(): Observable<FeedPost[]> {
    //     return this.feedService.findAllPosts();
    // }

    @Get()
    findSelected(@Query('take') take: number = 1, @Query('skip') skip: number = 1,): Observable<FeedPost[]> {
        take = take > 20 ? 20 : take;
        return this.feedService.findSelectedPost(take, skip);
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
