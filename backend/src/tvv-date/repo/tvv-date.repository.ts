import { tblVisitorVisitDate } from "../entities/tvv-date.entity";
import { EntityRepository,Repository } from "typeorm";
import { Injectable } from "@nestjs/common";


@EntityRepository(tblVisitorVisitDate)
@Injectable()
export class tvvDateRepository extends Repository<tblVisitorVisitDate>{}