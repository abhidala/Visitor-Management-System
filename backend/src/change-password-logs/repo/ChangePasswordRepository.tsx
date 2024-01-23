import { EntityRepository, Repository } from "typeorm";
import { tblChangePasswordReport } from "../entities/change-password-log.entity";
import { Injectable } from "@nestjs/common";

@EntityRepository(tblChangePasswordReport)
@Injectable()
export class ChangePasswordRepository extends Repository<tblChangePasswordReport>{}