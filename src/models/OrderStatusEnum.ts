export enum OrderStatus {
    PendingPayment = 1,
    Shipped,
    Cancelled,
    Delivered
}

export function OrderStatusDescriptor(orderStatus: OrderStatus) {
    switch (orderStatus) {
        case OrderStatus.PendingPayment:
            return "Aguardando Pagamento"
        case OrderStatus.Cancelled:
            return "Cancelado"
        case OrderStatus.Shipped:
            return "Em Trânsito"
        case OrderStatus.Delivered:
            return "Entregue"
        default:
            return "Não definido"
    }
}