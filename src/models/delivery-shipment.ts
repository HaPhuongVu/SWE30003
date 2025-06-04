import { Shipment } from './shipment';

class DeliveryShipment extends Shipment {
    partner: string;
    deliveryDate?: Date;
    address: string;

    constructor(id: string | null, status: string, partner: string, address: string, date?: Date) {
        super(id, status);
        this.partner = partner;
        this.deliveryDate = date;
        this.address = address;
        this.fee = this.calculateFee(); // Calculate fee for delivery shipments
    }

    calculateFee(): number {
        return 10;
    }

    updateDate(newDate: Date) {
        this.deliveryDate = newDate;
    }

    updateAddress(newAddress: string) {
        this.address = newAddress;
    }
}

export { DeliveryShipment };