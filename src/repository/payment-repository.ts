import { Payment } from "../models/payment";
import type { JointPayment } from "../models/payment";
import { CardPayment } from "../models/card-payment";
import { CashPayment } from "../models/cash-payment";

class PaymentRepository {
    private static _instance: PaymentRepository;
    private baseUrl = 'http://localhost:3000/payment';

    private constructor() {}

    public static get instance(): PaymentRepository {
        if (!PaymentRepository._instance) {
            PaymentRepository._instance = new PaymentRepository();
        }
        return PaymentRepository._instance;
    }

    private inferPaymentType(payment: JointPayment): Payment {
        if (payment.type === 'card') {
            return new CardPayment(
                payment.id,
                payment.amount,
                new Date(payment.date),
                payment.status,
                payment.cardNumber!,
                payment.expiryDate!,
                payment.paymentGateway!
            );
        } else if (payment.type === 'cash') {
            return new CashPayment(
                payment.id,
                payment.amount,
                new Date(payment.date),
                payment.status
            );
        }
        throw new Error('Unknown payment type');
    }

    async getAll(): Promise<Payment[]> {
        try {
            const response = await fetch(this.baseUrl);
            if (!response.ok) throw new Error('Failed to fetch payments');
            const payments = await response.json();
            return payments.map((payment: JointPayment) => this.inferPaymentType(payment));
        } catch (error) {
            throw new Error(`Failed to fetch payments: ${error}`);
        }
    }

    async getById(id: string): Promise<Payment> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`);
            if (!response.ok) throw new Error(`Failed to fetch payment ${id}`);
            const payment = await response.json();
            return this.inferPaymentType(payment);
        } catch (error) {
            throw new Error(`Failed to fetch payment: ${error}`);
        }
    }

    async create(
        amount: number,
        status: string,
        type: 'card' | 'cash',
        cardNumber?: string,
        expiryDate?: string,
        paymentGateway?: string
    ): Promise<Payment> {
        try {
            const date = new Date().toISOString();
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, date, status, type, cardNumber, expiryDate, paymentGateway })
            });
            if (!response.ok) throw new Error('Failed to create payment');
            return response.json();
        } catch (error) {
            throw new Error(`Failed to create payment: ${error}`);
        }
    }

    async update(
        id: string,
        data: Partial<JointPayment>,
    ): Promise<Payment> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update payment');
            return this.inferPaymentType(await response.json());
        } catch (error) {
            throw new Error(`Failed to update payment: ${error}`);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete payment');
        } catch (error) {
            throw new Error(`Failed to delete payment: ${error}`);
        }
    }
}

export { PaymentRepository };
