import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../Guards/auth.guard';
import { AuthService } from './auth.service';
import { RoleGuard } from '../Guards/roles.guard';

import { request } from 'express';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {

        return this.authService.signIn(signInDto.username, signInDto.password);
    }


    @Post('logout')
    async logout(@Request() req: any) {
        const token = this.extractTokenFromHeader(req);
        return this.authService.signOut(token);
    }

    @UseGuards(RoleGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers['authorization'];
        if (authHeader && typeof authHeader === 'string') {
            const [type, token] = authHeader.split(' ');
            if (type === 'Bearer' && token) {
                return token;
            }
        }
        return undefined;
    }


}
