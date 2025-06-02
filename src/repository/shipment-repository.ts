import type { Shipment, JointShipment } from "../models/shipment";
import { DeliveryShipment } from "../models/delivery-shipment";
import { PickupShipment } from "../models/pickup-shipment";

class ShipmentRepository {
    private static _instance: ShipmentRepository;
    private baseUrl = 'http://localhost:3000/shipment';

    private constructor() {}

    public static get instance(): ShipmentRepository {
        if (!ShipmentRepository._instance) {
            ShipmentRepository._instance = new ShipmentRepository();
        }
        return ShipmentRepository._instance;
    }

    private inferShipmentType(shipment: JointShipment): Shipment {
        if (shipment.type === 'delivery') {
            return new DeliveryShipment(
                shipment.id,
                shipment.status,
                shipment.partner!,
                new Date(shipment.deliveryDate!),
                shipment.address!
            );
        } else if (shipment.type === 'pickup') {
            return new PickupShipment(
                shipment.id,
                shipment.status,
                new Date(shipment.pickupTime!)
            );
        }
        throw new Error('Unknown shipment type');
    }

    async getAll(): Promise<Shipment[]> {
        try {
            const response = await fetch(this.baseUrl);
            if (!response.ok) throw new Error('Failed to fetch shipments');
            const shipments = await response.json();
            return shipments.map((shipment: JointShipment) => this.inferShipmentType(shipment));
        } catch (error) {
            throw new Error(`Failed to fetch shipments: ${error}`);
        }
    }

    async getById(id: string): Promise<Shipment> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`);
            if (!response.ok) throw new Error(`Failed to fetch shipment ${id}`);
            return this.inferShipmentType(await response.json());
        } catch (error) {
            throw new Error(`Failed to fetch shipment: ${error}`);
        }
    }

    async create(
        type: 'delivery' | 'pickup',
        status: string,
        fee: number,
        partner?: string,
        date?: string,
        address?: string,
        pickupTime?: string
    ): Promise<Shipment> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, fee, type, partner, date, address, pickupTime })
            });
            if (!response.ok) throw new Error('Failed to create shipment');
            return this.inferShipmentType(await response.json());
        } catch (error) {
            throw new Error(`Failed to create shipment: ${error}`);
        }
    }

    async update(
        id: string,
        data: Partial<JointShipment>
    ): Promise<Shipment> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update shipment');
            return this.inferShipmentType(await response.json());
        } catch (error) {
            throw new Error(`Failed to update shipment: ${error}`);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete shipment');
        } catch (error) {
            throw new Error(`Failed to delete shipment: ${error}`);
        }
    }
}

export { ShipmentRepository };
