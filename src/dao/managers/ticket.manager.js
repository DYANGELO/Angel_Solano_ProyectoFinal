import { Ticket } from "../../models/ticket.model.js";

export class TicketManager {
  async createTicket({ code, amount, purchaser }) {
    try {
      const newTicket = new Ticket({
        code,
        amount,
        purchaser,
      });

      await newTicket.save();
      return newTicket;
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      throw new Error("No se pudo crear el ticket");
    }
  }

  async getTicketById(ticketId) {
    try {
      return await Ticket.findById(ticketId);
    } catch (error) {
      console.error("Error al obtener el ticket:", error);
      return null;
    }
  }

  async getAllTickets() {
    try {
      return await Ticket.find();
    } catch (error) {
      console.error("Error al obtener los tickets:", error);
      return [];
    }
  }
}
