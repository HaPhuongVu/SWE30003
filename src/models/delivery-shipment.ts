import { Shipment } from './shipment';

class DeliveryShipment extends Shipment {
    partner: string;
    date: Date;
    address: string;

    constructor(id: string, status: string, partner: string, date: Date, address: string, fee: number) {
        super(id, status, fee);
        this.partner = partner;
        this.date = date;
        this.address = address;
    }

    updateDate(newDate: Date) {
        this.date = newDate;
    }

    updateAddress(newAddress: string) {
        this.address = newAddress;
    }
}

export { DeliveryShipment };