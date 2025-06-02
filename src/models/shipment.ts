type JointShipment = {
    id: string;
    type: 'delivery' | 'pickup';
    status: string;
    fee: number;
    pickupTime?: Date | string;
    partner?: string;
    deliveryDate?: Date | string;
    address?: string;
};

abstract class Shipment {
    id: string | null;
    status: string;
    fee: number = 0; // Default fee, can be overridden in subclasses

    constructor(id: string | null, status: string) {
        this.id = id;
        this.status = status;
    }

    updateStatus(status: string) {
        this.status = status;
    }
}

export { Shipment };
export type { JointShipment };