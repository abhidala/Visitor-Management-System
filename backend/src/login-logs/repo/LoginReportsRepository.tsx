import { EntityRepository, Repository } from "typeorm";
import { tblLoginReport } from "../entities/login-log.entity";
import { Injectable } from "@nestjs/common";

@EntityRepository(tblLoginReport)
@Injectable()
export class LoginReportRepository extends Repository<tblLoginReport>{}