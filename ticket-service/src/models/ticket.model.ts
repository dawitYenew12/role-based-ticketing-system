/* eslint-disable */
import mongoose, { Document, Schema } from 'mongoose';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'In Progress',
  ClOSED = 'closed',
}

export interface ITicket extends Document {
  title: string;
  description: string;
  status: string;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(TicketStatus),
    default: TicketStatus.OPEN,
  },
  createdBy: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITicket>('Ticket', ticketSchema);
