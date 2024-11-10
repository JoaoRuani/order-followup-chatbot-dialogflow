import Intent, { IntentParameters } from "./Intent"
import prisma from "../prisma/client"
import { OrderStatus } from "../models/OrderStatusEnum"
import moment from "moment"

export default class OrderPaymentProblem extends Intent {
    async handle(targetIntent: string, parameters: IntentParameters): Promise<string | null> {
        if (targetIntent !== 'Order - Payment Problem') {
            return this.nextHandler!.handle(targetIntent, parameters)
        }

        const cpf = parameters.current.cpf
        const order_number = parameters.current.order_number

        //check database for the order
        const consumer = await prisma.consumer.findFirst({
            where: { orders: cpf },
            include: {
                orders: {
                    where: { number: order_number }
                }
            }
        })

        const order = consumer?.orders[0]
        const paymentDate: string = parameters.current.paymentDate

        if (order?.status == OrderStatus.PendingPayment) {

            if (paymentDate) {

                const paymentDateParsed = moment(paymentDate)
                const hoursFromNow = paymentDateParsed.endOf('day').diff(moment(), 'hours')

                let message = `Entendi, então você fez o pagamento do seu pedido no dia ${paymentDateParsed.format('DD/MM/YYYY')}.\n`
                if (hoursFromNow < 48) {
                    message += `O pagamento pode levar até 48 horas úteis para ser processado, e pela data que você pagou ainda falta algum tempinho.\n Caso seu pedido não tenha sido atualizado após as 48 horas, entre em contato novamente.`
                }
                else {
                    message += `Aparentemente seu pagamento está levando mais tempo que o normal para ser processado. Infelizmente eu ainda não sou capaz de ajudar com esse problema, por favor contacte a central no número 030 1223 492.`
                }
                return message
            }
            else {
                return "Seu pedido ainda está aguardando o pagamento para ser liberado. Por favor, contacte a central no número 030 1223 492 para obter ajuda."
            }
        }
        else {
            return "Seu pedido já foi processado. Caso tenha sido cobrado indevidamente, o valor pode levar até 48 horas para ser estornado. Caso precise resolver outro problema, contacte a central no número 030 1223 492."   
        }
    }
}