import fastify from "fastify";

import { PlaceOrder } from "./useCases/PlaceOrder";

import { DynamoOrdersRepository } from "./repository/DynamoOrdersRepository";

import { SQSGateway } from "./gateways/SQSGateway";
import { SESGateway } from "./gateways/SESGateway";

import { Registry } from "./di/Registry";

const app = fastify();

const container = Registry.getInstance();

app.post("/orders", async (request, reply) => {
  const placeOrder = new PlaceOrder(
    container.resolve(DynamoOrdersRepository),
    container.resolve(SQSGateway),
    container.resolve(SESGateway),
  );

  const { orderId } = await placeOrder.execute();

  reply.status(201).send({ orderId });
});

app.listen({ port: 3000 }).then(() => {
  console.log("Server started at http://localhost:3000");
});
