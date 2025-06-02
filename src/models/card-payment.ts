import { Payment } from './payment';

class CardPayment extends Payment {
    cardNumber: string;
    expiryDate: string;
    paymentGateway: string;

    constructor(id: string, amount: number, date: Date, status: string, cardNumber: string, expiryDate: string, paymentGateway: string) {
        super(id, amount, date, status);
        this.cardNumber = cardNumber;
        this.expiryDate = expiryDate;
        this.paymentGateway = paymentGateway;
    }

    verify() {
        // Cash payments are always verified
        return true;
    }

    process() {
        this.connectToGateway();
        this.updateStatus('Processed');
    }

    refund() {
        this.updateStatus('Refunded');
    }

    connectToGateway() {
        return;
    }

}

export { CardPayment };