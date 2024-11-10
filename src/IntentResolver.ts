import CancelOrderIntent from "./intents/CancelOrderIntent"
import Intent, { IntentParameters } from "./intents/Intent"
import OrderFollowUpIntent from "./intents/OrderFollowupIntent"
import OrderPaymentProblem from "./intents/OrderPaymentProblem"

export default class IntentResolver {
    
    private intentChain: Intent

    constructor() {
        const defaultIntent = new Intent()
        const orderFollowupIntent = new OrderFollowUpIntent()
        const orderPaymentProblem = new OrderPaymentProblem()
        const cancelOrderIntent = new CancelOrderIntent()
        orderFollowupIntent
            .setNext(orderPaymentProblem)
            .setNext(cancelOrderIntent)
            .setNext(defaultIntent) //must be last one

        
        this.intentChain = orderFollowupIntent
    }

    async resolve(targetIntent: string, parameters: IntentParameters) {
        return await this.intentChain.handle(targetIntent, parameters)
    }
}