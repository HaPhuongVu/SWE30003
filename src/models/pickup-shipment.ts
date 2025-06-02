import { Shipment } from './shipment';

class PickupShipment extends Shipment {
    pickupTime: Date;

    constructor(id: string, status: string, pickupTime: Date) {
        super(id, status, 0); // Pickup shipments typically have no fee
        this.pickupTime = pickupTime;
    }

    updatePickupTime(newTime: Date) {
        this.pickupTime = newTime;
    }
}

export { PickupShipment };