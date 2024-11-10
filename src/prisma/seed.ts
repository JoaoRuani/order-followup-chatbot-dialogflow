import { PrismaClient } from '@prisma/client'
import { OrderStatus } from '../models/OrderStatusEnum'
const prisma = new PrismaClient()
async function main() {

  const c1 = await prisma.consumer.upsert({
    where: { cpf: '11111111111' },
    update: {},
    create: {
      cpf: '11111111111',
      name: 'José da Silva',
      orders: {
        create: {
          number: 12345,
          status: OrderStatus.PendingPayment
        },
      },
    },
  })

  const c2 = await prisma.consumer.upsert({
    where: { cpf: '22222222222' },
    update: {},
    create: {
      cpf: '22222222222',
      name: 'Maria Joaquina',
      orders: {
        create: {
          number: 41232,
          status: OrderStatus.Delivered
        },
      },
    },
  })

  const c3 = await prisma.consumer.upsert({
    where: { cpf: '33333333333' },
    update: {},
    create: {
      cpf: '33333333333',
      name: 'Carlos Alberto',
      orders: {
        create: {
          number: 34353,
          status: OrderStatus.Shipped
        },
      },
    },
  })

  console.log(c1, c2, c3)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })