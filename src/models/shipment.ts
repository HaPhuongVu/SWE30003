type JointShipment = {
    id: string;
    type: string;
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
    fee: number = 0;
    type: string

    constructor(id: string | null, status: string, type: string) {
        this.id = id;
        this.status = status;
        this.type = type;
    }

    updateStatus(status: string) {
        this.status = status;
    }
}

export { Shipment };
export type { JointShipment };