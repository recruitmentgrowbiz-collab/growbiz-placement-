export type Notification = {
  id: string;
  userId: string;
  channel: "in_app" | "email" | "sms" | "whatsapp";
  template: string;
  status: "queued" | "sent" | "failed" | "read";
  payload: Record<string, unknown>;
  createdAt: string;
  readAt?: string;
};
