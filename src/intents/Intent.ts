export default class Intent {
    protected nextHandler: Intent | null = null 

    setNext(handler: Intent): Intent {
        this.nextHandler = handler;
        return handler;
      }
    
    async handle(targetIntent: string, parameters: IntentParameters): Promise<string | null> {
        //default implementation, should be overriden
        if (this.nextHandler) {
            return this.nextHandler.handle(targetIntent, parameters);
        }

        return null;
    }
}
export interface IntentParameters {
    current: {[key: string]: any},
    context: {[key: string]: any}
}