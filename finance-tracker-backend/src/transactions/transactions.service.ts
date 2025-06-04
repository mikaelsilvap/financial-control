import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transactionData = {
      ...createTransactionDto,
      date: new Date(createTransactionDto.date),
    };
    return this.prisma.transaction.create({
      data: transactionData,
    });
  }
  async findAll() {
    return this.prisma.transaction.findMany();
  }
  async remove(id: number) {
    try {
      await this.prisma.transaction.delete({
        where: { id },
      });
      return { message: `Lançamento com ID ${id} deletado com sucesso!` };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Lançamento com ID ${id} não encontrado.`);
      }
      throw error;
    }
  }

  async calculateSummary() {
    const transactions = await this.prisma.transaction.findMany();
    const totalEntries = transactions
      .filter((t) => t.value > 0)
      .reduce((sum, t) => sum + t.value, 0);
    const totalExpenses = transactions
      .filter((t) => t.value < 0)
      .reduce((sum, t) => sum + t.value, 0);
    const currentBalance = totalEntries + totalExpenses;

    return { totalEntries, totalExpenses, currentBalance };
  }
}
