import { EntityRepository,Repository } from "typeorm";
import { tblVisitor } from "../entities/tblVisitor.entity";
import {Injectable} from '@nestjs/common'


@EntityRepository(tblVisitor)
@Injectable()
export class PassRepository extends Repository<tblVisitor>{}