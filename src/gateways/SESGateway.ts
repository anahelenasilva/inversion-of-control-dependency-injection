import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

import { IEmailGateway, SendMailParams } from "../interfaces/gateways/IEmailGateway";

export class SESGateway implements IEmailGateway {
  private client: SESClient;

  constructor() {
    this.client = new SESClient({ region: "us-east-1" });
  }

  async sendMail({ from, to, subject, html }: SendMailParams): Promise<void> {
    const command = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Subject: {
          Charset: "utf-8",
          Data: subject,
        },
        Body: {
          Html: {
            Charset: "utf-8",
            Data: html,
          }
        }
      }
    });

    await this.client.send(command);

  }
}
