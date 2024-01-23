import { Repository } from "typeorm"
import { tblAppoinTmentGenerate } from "../entities/visitor-appointment-generate.entity"


export class AppointmentRepository extends Repository <tblAppoinTmentGenerate>{}