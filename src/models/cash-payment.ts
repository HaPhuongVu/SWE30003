import { Payment } from './payment';

class CashPayment extends Payment {
    constructor(id: string, amount: number, date: Date, status: string) {
        super(id, amount, date, status);
    }

    verify() {
        // Cash payments are always verified
        return true;
    }

    async process() {
        this.updateStatus('Processed');
    }

    async refund() {
        this.updateStatus('Refunded');
    }
}

export { CashPayment };