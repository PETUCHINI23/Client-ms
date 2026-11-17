import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationDto } from '../common/dto';
import { IdDto } from './dto/id.dto';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @MessagePattern({ cmd: 'create_customer' })
  create(@Payload() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @MessagePattern({ cmd: 'find_all_customers' })
  findAll(@Payload() pagination: PaginationDto) {
    return this.customersService.findAll(pagination);
  }

  @MessagePattern({ cmd: 'find_one_customer' })
  findOne(@Payload() { id }: IdDto) {
    return this.customersService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_customer' })
  update(@Payload() dto: UpdateCustomerDto) {
    return this.customersService.update(dto);
  }

  @MessagePattern({ cmd: 'remove_customer' })
  remove(@Payload() { id }: IdDto) {
    return this.customersService.remove(id);
  }
}
