import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from '../Guards/auth.guard';
import { AuthService } from '../auth/auth.service';
import { RoleGuard } from '../Guards/roles.guard';
@Controller('users')
export class UsersController {



}
