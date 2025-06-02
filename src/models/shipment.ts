type JointShipment = {
    id: string;
    type: 'delivery' | 'pickup';
    status: string;
    fee: number;
    pickupTime?: Date | string;
    partner?: string;
    date?: Date | string;
    address?: string;
};

abstract class Shipment {
    id: string;
    status: string;
    fee: number;

    constructor(id: string, status: string, fee: number) {
        this.id = id;
        this.status = status;
        this.fee = fee;
    }

    updateStatus(status: string) {
        this.status = status;
    }
}

export { Shipment };
export type { JointShipment };