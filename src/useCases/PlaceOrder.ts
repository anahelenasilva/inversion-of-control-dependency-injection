import { Order } from "../entities/Order";

import { IOrdersRepository } from "../interfaces/repository/IOrdersRepository";

import { IQueueGateway } from "../interfaces/gateways/IQueueGateway";
import { IEmailGateway } from "../interfaces/gateways/IEmailGateway";

export class PlaceOrder {
  constructor(private readonly ordersRepository: IOrdersRepository,
    private readonly queueGateway: IQueueGateway,
    private readonly emailGateway: IEmailGateway) { }

  async execute() {
    const customerEmail = "ana@teste.com";
    const amount = Math.ceil(Math.random() * 1000);

    const order = new Order(customerEmail, amount);

    await this.ordersRepository.create(order);
    await this.queueGateway.publishMessage({ orderId: order.id });
    await this.emailGateway.sendMail({
      from: "MyStore <noreply@mystore.com>",
      to: [customerEmail],
      subject: `Pedido ${order.id} confirmado`,
      html: `<h1>Olá!</h1>
              <p>Pedido confirmado com sucesso!</p>
            `,
    });

    return {
      orderId: order.id,
    }
  }
}
