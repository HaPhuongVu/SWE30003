import type { Shipment } from "../models/shipment";
import { ShipmentRepository } from "../repository/shipment-repository";

class ShipmentController {
    private static _instance: ShipmentController;

    private constructor() {}

    static get instance(): ShipmentController {
        if (!ShipmentController._instance) {
            ShipmentController._instance = new ShipmentController();
        }
        return ShipmentController._instance;
    }

    async getAllShipments(): Promise<Shipment[]> {
        try {
            return await ShipmentRepository.instance.getAll();
        } catch (error) {
            throw new Error(`Failed to get shipments: ${error}`);
        }
    }

    async getShipmentById(id: string): Promise<Shipment> {
        try {
            return await ShipmentRepository.instance.getById(id);
        } catch (error) {
            throw new Error(`Failed to get shipment: ${error}`);
        }
    }

    async createShipment(
        type: 'delivery' | 'pickup',
        status: string,
        fee: number,
        partner?: string,
        date?: string,
        address?: string,
        pickupTime?: string
    ): Promise<Shipment> {
        try {
            if (type === 'delivery' && (!partner || !date || !address)) {
                throw new Error('Partner, date, and address are required for delivery shipments');
            } else if (type === 'pickup' && (!pickupTime || fee !== 0)) {
                throw new Error('Pickup time must be provided and fee should be 0 for pickup shipments');
            }
            return await ShipmentRepository.instance.create(
                type,
                status,
                fee,
                partner,
                date,
                address,
                pickupTime
            );
        } catch (error) {
            throw new Error(`Failed to create shipment: ${error}`);
        }
    }

    async updateShipment(id: string, data: Partial<Shipment>): Promise<Shipment> {
        try {
            return await ShipmentRepository.instance.update(id, data);
        } catch (error) {
            throw new Error(`Failed to update shipment: ${error}`);
        }
    }

    async deleteShipment(id: string): Promise<void> {
        try {
            await ShipmentRepository.instance.delete(id);
        } catch (error) {
            throw new Error(`Failed to delete shipment: ${error}`);
        }
    }
}

export { ShipmentController };
