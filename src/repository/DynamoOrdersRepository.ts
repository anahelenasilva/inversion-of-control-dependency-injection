import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { IOrdersRepository } from "../interfaces/repository/IOrdersRepository";

import { Order } from "../entities/Order";

import { ILogGateway } from "../interfaces/gateways/ILogGateway";

import { Inject } from "../di/Inject";

export class DynamoOrdersRepository implements IOrdersRepository {
  private client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-east-1" })
  );

  constructor(
    @Inject("LogGateway") private readonly logGateway: ILogGateway
  ) { }

  async create(order: Order): Promise<void> {
    const command = new PutCommand({
      TableName: "Orders",
      Item: order,
    });

    await this.logGateway.log({
      ...order,
    });

    await this.client.send(command);
  }
}
