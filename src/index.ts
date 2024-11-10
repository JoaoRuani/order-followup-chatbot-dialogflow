import express from 'express'
import { Request, Response } from 'express'
import IntentResolver from './IntentResolver'

const app = express()
const port = 3000

app.use(express.json())
app.use(express.static('src/public'))
app.post('/dialogflow', async (req: Request, res: Response) => {
    const intent = req.body.queryResult.intent.displayName
    const current_parameters = req.body.queryResult.parameters
    const context = req.body.queryResult.outputContexts

    let parametersFromContext: {[x: string]: any} = {}
    
    if(context) {
        for (let x of context) {
            Object.keys(x.parameters).forEach(k => parametersFromContext[k] = x.parameters[k])
        }
    }

    const intentResolver = new IntentResolver()
    const responseText = await intentResolver.resolve(intent, 
        {
            context: parametersFromContext, 
            current: current_parameters
        })

    res.json(
        {
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            responseText
                        ]
                    }
                }
            ]
        }
    )
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})