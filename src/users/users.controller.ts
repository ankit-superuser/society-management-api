import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUsersQueryDto } from './dto/get-users-query.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('list')
    async getUsers(@Query() query: GetUsersQueryDto) {
        return this.usersService.getUsers(query);
    }
}