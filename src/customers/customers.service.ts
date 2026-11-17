import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    await this.ensureEmailAvailable(dto.email);
    return this.prisma.customer.create({ data: dto });
  }

  async findAll({ page, limit }: PaginationDto) {
    const total = await this.prisma.customer.count();
    const data = await this.prisma.customer.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' },
    });
    return {
      data,
      meta: { total, page, lastPage: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Customer with id #${id} not found`,
      });
    }
    return customer;
  }

  async update({ id, ...data }: UpdateCustomerDto) {
    await this.findOne(id);
    if (data.email) await this.ensureEmailAvailable(data.email, id);
    return this.prisma.customer.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.customer.delete({ where: { id } });
  }

  private async ensureEmailAvailable(email: string, excludeId?: number) {
    const existing = await this.prisma.customer.findUnique({ where: { email } });
    if (existing && existing.id !== excludeId) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: `Customer with email ${email} already exists`,
      });
    }
  }
}
