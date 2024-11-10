import Intent, { IntentParameters } from "./Intent"
import prisma from "../prisma/client"
import { OrderStatus } from "../models/OrderStatusEnum"

export default class OrderFollowUpIntent extends Intent {
    async handle(targetIntent: string, parameters: IntentParameters): Promise<string | null> {
        if (targetIntent !== 'Order') {
            return this.nextHandler!.handle(targetIntent, parameters)
        }
        const cpf = parameters.current.cpf
        const order_number = parameters.current.order_number

        //check database for the order
        const consumer = await prisma.consumer.findFirst({
            where: { cpf: cpf },
            include: {
                orders: {
                    where: { number: order_number }
                }
            }
        })

        if (!consumer) {
            return `Desculpe, mas não encontrei você no nosso sistema, pode conferir se o CPF informado está correto?`
        }

        const order = consumer.orders[0]

        if (!order) {
            return `Desculpe, mas não encontrei o pedido ${order_number}, pode conferir se o número informado está correto?`
        }
        let orderStatusMessage: string = '';
        switch (order.status) {
            case OrderStatus.PendingPayment:
                orderStatusMessage = 'está aguardando pagamento.'
                break
            case OrderStatus.Shipped:
                orderStatusMessage = 'está a caminho do seu endereço!'
                break
            case OrderStatus.Cancelled:
                orderStatusMessage = `foi cancelado. Motivo: "${order.cancellation_reason}"\n`
                break
            case OrderStatus.Delivered:
                orderStatusMessage = 'já foi entregue. Espero que tenha gostado!'
                break;
            default:
                break;
        }

        return `Olá ${consumer.name}!\n` +
            `O pedido ${order_number} ${orderStatusMessage}\n` +
            `Do que você precisa?`
    }
}