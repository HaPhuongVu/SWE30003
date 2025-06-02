import { Shipment } from './shipment';

class PickupShipment extends Shipment {
    pickupTime: Date | null;

    constructor(id: string | null, status: string, pickupTime?: Date) {
        super(id, status);
        this.pickupTime = pickupTime || null;
        this.fee = 0; // Pickup shipments typically have no fee
    }

    updatePickupTime(newTime: Date) {
        this.pickupTime = newTime;
    }
}

export { PickupShipment };