import { Payment } from './payment';

class CardPayment extends Payment {
    cardNumber: string;
    expiryDate: string;
    paymentGateway: string;

    constructor(id: string | null, amount: number, type: string, date: Date, status: string, cardNumber: string, expiryDate: string, paymentGateway: string) {
        super(id, amount, type, date, status);
        this.cardNumber = cardNumber;
        this.type = 'card'
        this.expiryDate = expiryDate;
        this.paymentGateway = paymentGateway;
    }

    verify() {
        return true;
    }

    async process() {
        await this.connectToGateway();
        this.updateStatus('Processed');
    }

    async refund() {
        this.updateStatus('Refunded');
    }

    async connectToGateway() {
        return;
    }

}

export { CardPayment };