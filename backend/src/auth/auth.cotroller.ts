import { UseGuards , Controller , Post,Req,Body } from "@nestjs/common";
import { tblUserDetails } from "../user/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
import {LoginDto} from './dto/login.dto';
import { LoginLogsService } from "../login-logs/login-logs.service";
import { CreateLoginLogDto } from "../login-logs/dto/create-login-log.dto";


@Controller('auth')
export class AuthController{

constructor (
    private jwtService : JwtService,
    private readonly loginLogsService:LoginLogsService,
    ){}
@Post ('/login')
@UseGuards (AuthGuard ('local'))
async login(@Req() req , @Body() loginDto: LoginDto ){

    const user: tblUserDetails = req.user;
    const payload = {
        userId : user.userId ,
        indexId : user.indexId,
        userName : user.userName,
        designation : user.designation,
        address : user.address,
        userType : user.userType,
        deleted : user.deleted,
        resetAdmin : user.resetAdmin
    };
    const loginLogDto: CreateLoginLogDto = {
        userId: user.userId,
        LogedInDateTime: new Date(), // Set the login time
        LogedOutDateTime: null, // Initially set to null
      };

 await this.loginLogsService.logLogin(loginLogDto);

    return {token : this.jwtService.sign(payload)};
}
}