import { Ticket } from "../models/ticket.model.js";

export class TicketRepository {
  // Crear ticket
  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  // Buscar ticket por ID
  async findById(id) {
    return await Ticket.findById(id);
  }

  // Buscar todos los tickets de un usuario
  async findByPurchaser(purchaserEmail) {
    return await Ticket.find({ purchaser: purchaserEmail });
  }
}