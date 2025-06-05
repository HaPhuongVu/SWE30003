import { Payment } from './payment';

class CashPayment extends Payment {
    constructor(id: string | null, amount: number, type: string, date: Date, status: string) {
        super(id, amount, type, date, status);
        this.type = 'cash'
        this.date = date
        this.status = status
        this.amount = amount
        this.id = id
    }

    verify() {
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