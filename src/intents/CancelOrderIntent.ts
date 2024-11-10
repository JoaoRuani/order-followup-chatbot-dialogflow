import Intent, { IntentParameters } from "./Intent"
import prisma from "../prisma/client"
import { OrderStatus } from "../models/OrderStatusEnum"

export default class CancelOrderIntent extends Intent {
    async handle(targetIntent: string, parameters: IntentParameters): Promise<string | null> {
        if (targetIntent !== 'Order - Cancel - yes') {
            return this.nextHandler!.handle(targetIntent, parameters)
        }
        const cpf = parameters.context.cpf
        const order_number = parameters.context.order_number
        const cancellation_reason = parameters.current.reason
        if(!cpf || !order_number) {
            throw new Error('Missing CPF or order_number')
        }
        console.log(`cpf: ${cpf}, order: ${order_number}, reason: ${cancellation_reason}`)
        //check database for the order
        const consumer = await prisma.consumer.findFirst({
            where: { cpf: cpf },
            include: {
                orders: {
                    where: { number: order_number }
                }
            }
        })

        const order = consumer!.orders[0]

        if(order.status == OrderStatus.Cancelled) {
            return `O pedido ${order_number} já se encontra cancelado. `
        }

        if(order.status == OrderStatus.Delivered) {
            return `Não é possível cancelar o pedido ${order_number} pois ele já foi entregue. Caso deseje suporte adicional, contacte a central no número 030 1223 492. `
        }
        
        await prisma.order.update({
            where: { id: order.id },
            data: { status: OrderStatus.Cancelled, cancellation_reason: cancellation_reason }
        })

        return `Pedido ${order_number} foi cancelado.`
    }
}