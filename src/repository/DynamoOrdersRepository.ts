import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { Injectable } from "../di/Injectable";

import { IOrdersRepository } from "../interfaces/repository/IOrdersRepository";

import { Order } from "../entities/Order";

@Injectable()
export class DynamoOrdersRepository implements IOrdersRepository {
  private dynamodbDocumentClient: DynamoDBDocumentClient;

  constructor() {
    const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(dynamoClient);
  }

  async create(order: Order): Promise<void> {
    const command = new PutCommand({
      TableName: "Orders",
      Item: order,
    });

    await this.dynamodbDocumentClient.send(command);
  }
}
