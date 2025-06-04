import { DeliveryShipment } from "../models/delivery-shipment";
import { PickupShipment } from "../models/pickup-shipment";
import type { Shipment, JointShipment } from "../models/shipment";
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

    createShipmentObject(data: Partial<JointShipment>): Shipment {
        try {
            const { type, status, partner, deliveryDate, address, pickupTime } = data;
            if (type === 'delivery') {
                if (!partner || !address) throw new Error('Partner and address are required for delivery shipments');
                else {
                    return new DeliveryShipment(
                        null,
                        status || 'pending',
                        partner,
                        address,
                        deliveryDate ? new Date(deliveryDate) : undefined
                    );
                }
            } else if (type === 'pickup') {
                return new PickupShipment(
                    null,
                    status || 'pending',
                    pickupTime ? new Date(pickupTime) : undefined
                );
            } else {
                throw new Error(`Unknown shipment type ${type}`);
            }
        } catch (error) {
            throw new Error(`Failed to create shipment object: ${error}`);
        }
    }

    async storeShipment(shipment: Shipment): Promise<Shipment> {
        try {
            return await ShipmentRepository.instance.create(
                shipment instanceof DeliveryShipment ? 'delivery' : 'pickup',
                shipment.status,
                shipment.fee,
                shipment instanceof DeliveryShipment ? shipment.partner : undefined,
                shipment instanceof DeliveryShipment ? shipment.deliveryDate?.toISOString() : undefined,
                shipment instanceof DeliveryShipment ? shipment.address : undefined,
                shipment instanceof PickupShipment ? shipment.pickupTime?.toISOString() : undefined
            );
        } catch (error) {
            throw new Error(`Failed to store shipment: ${error}`);
        }
    }

    async createShipment(data: Partial<JointShipment>): Promise<Shipment> {
        try {
            const shipmentObject = this.createShipmentObject(data);
            return await this.storeShipment(shipmentObject);
        } catch (error) {
            throw new Error(`Failed to create shipment: ${error}`);
        }
    }

    async updateShipment(id: string, data: Partial<JointShipment>): Promise<Shipment> {
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
