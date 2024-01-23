
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
        const errorMessage = this.buildErrorMessage(errors);
      throw new BadRequestException('Validation failed', errorMessage);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object, Date]; // Include Date type
    return !types.some(type => metatype === type);
  }
  private buildErrorMessage(errors: any[]): string {
    return errors
      .map((error) => Object.values(error.constraints).join(', '))
      .join(', ');
  }
}
