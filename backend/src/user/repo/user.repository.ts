import {  tblUserDetails } from "../entities/user.entity";
import { EntityRepository,Repository} from 'typeorm';
import { Injectable } from "@nestjs/common";
@EntityRepository(tblUserDetails)
@Injectable()
export class UserRepository extends Repository <tblUserDetails>{}