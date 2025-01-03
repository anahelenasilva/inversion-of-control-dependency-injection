import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

import { IQueueGateway } from "../interfaces/gateways/IQueueGateway";

export class SQSGateway implements IQueueGateway {
  private client: SQSClient;

  constructor() {
    this.client = new SQSClient({ region: "us-east-1" });
  }

  async publishMessage(message: Record<string, unknown>): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/123456789012/OrdersQueue",
      MessageBody: JSON.stringify(message),
    });

    await this.client.send(command);
  }
}
