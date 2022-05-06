import { IsCreatorGuard } from './../guards/is-creator.guard';
import { RolesGuard } from './../../auth/guards/roles.guard';
import { Role } from './../../auth/models/role.enum';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { FeedService } from '../services/feed.service';
import { FeedPost } from './../models/post.interface';

@Controller('feed')
export class FeedController {

    constructor(private feedService: FeedService) { }

    // @Roles(Role.ADMIN, Role.PREMIUM)
    // @UseGuards(JwtGuard, RolesGuard)
    @Post()
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
    @UseGuards(JwtGuard, IsCreatorGuard)
    update(@Param('id') id: number, @Body() feedPost: FeedPost): Observable<UpdateResult> {
        return this.feedService.update(id, feedPost);
    }

    // @UseGuards(JwtGuard, IsCreatorGuard)
    @Delete(':id')
    delete(@Param('id') id: number): Observable<DeleteResult> {
        return this.feedService.delete(id);
    }
}
