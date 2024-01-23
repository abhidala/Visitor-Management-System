import { EntityRepository, Repository } from "typeorm";
import { PassCancelDetail } from "../entities/pass-cancel-detail.entity";

@EntityRepository(PassCancelDetail)
export class CancelPassRepository extends Repository<PassCancelDetail>{}