import { EntityRepository, Repository } from "typeorm";
import { tblGateInOutReport } from "../entities/gate-in-out-log.entity";
import { Injectable } from "@nestjs/common";

@EntityRepository(tblGateInOutReport)
@Injectable()
export class GateInOutRepository extends Repository<tblGateInOutReport>{}