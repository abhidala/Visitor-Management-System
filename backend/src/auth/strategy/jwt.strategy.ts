import { PassportStrategy } from "@nestjs/passport";
import { Strategy , ExtractJwt} from "passport-jwt";
import { Constants } from "src/user/constants/user.constants";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class JwtStrategy extends PassportStrategy (Strategy){

    constructor (public configService:ConfigService){

        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration : false,
            secretOrKey : Constants.JWT_KEY
        });
    }
    async validate (payload:any)
    {
       return {
        userId: payload.userId,
        indexId : payload.indexId,
        userName : payload.userName,
        designation : payload.designation,
        address : payload.address,
        userType : payload.userType,
        deleted:payload.delete

       }
    }
}