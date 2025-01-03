export interface SendMailParams {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

export interface IEmailGateway {
  sendMail(params: SendMailParams): Promise<void>;
}
