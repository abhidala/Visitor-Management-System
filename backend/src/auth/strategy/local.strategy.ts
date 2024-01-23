import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { tblUserDetails } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
constructor (private userService : UserService){
    super({
        usernameField : "userName",
        passwordField : "password",
        
    })
}
async validate (userName : string , password : string ) : Promise <tblUserDetails>
{
    const user: tblUserDetails = await this.userService.findOneByUsername(userName);
    if (!user) {
        throw new UnauthorizedException("User not found: " + userName);
      }
  
      // if (user.password !== password) {
      //   throw new UnauthorizedException("Invalid password");
      // }
      const deleted = user.deleted;
      
      if(deleted){
        throw new UnauthorizedException('User Deleted');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
     
       
      return user;

}
}