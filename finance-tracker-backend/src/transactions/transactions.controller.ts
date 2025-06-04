// finance-tracker-backend/src/transactions/transactions.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Body(new ValidationPipe()) createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  async findAll() {
    return this.transactionsService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }

  @Get('summary')
  async getSummary() {
    return this.transactionsService.calculateSummary();
  }
}
