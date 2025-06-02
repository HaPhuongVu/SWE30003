import type { Payment } from "../models/payment";
import { PaymentRepository } from "../repository/payment-repository";

class PaymentController {
    private static _instance: PaymentController;

    private constructor() {}

    static get instance(): PaymentController {
        if (!PaymentController._instance) {
            PaymentController._instance = new PaymentController();
        }
        return PaymentController._instance;
    }

    async getAllPayments(): Promise<Payment[]> {
        try {
            return await PaymentRepository.instance.getAll();
        } catch (error) {
            throw new Error(`Failed to get payments: ${error}`);
        }
    }

    async getPaymentById(id: string): Promise<Payment> {
        try {
            return await PaymentRepository.instance.getById(id);
        } catch (error) {
            throw new Error(`Failed to get payment: ${error}`);
        }
    }

    async createPayment(
        amount: number,
        status: string,
        type: 'card' | 'cash',
        cardNumber?: string,
        expiryDate?: string,
        paymentGateway?: string
    ): Promise<Payment> {
        try {
            if (type === 'card' && (!cardNumber || !expiryDate || !paymentGateway)) {
                throw new Error('Card details are required for card payments');
            } else if (type === 'cash' && (cardNumber || expiryDate || paymentGateway)) {
                throw new Error('Card details should not be provided for cash payments');
            }
            return await PaymentRepository.instance.create(
                amount,
                status,
                type,
                cardNumber,
                expiryDate,
                paymentGateway
            );
        } catch (error) {
            throw new Error(`Failed to create payment: ${error}`);
        }
    }

    async updatePayment(id: string, data: Partial<Payment>): Promise<Payment> {
        try {
            return await PaymentRepository.instance.update(id, data);
        } catch (error) {
            throw new Error(`Failed to update payment: ${error}`);
        }
    }

    async processPayment(payment: Payment): Promise<Payment> {
        try {
            await payment.process();
            return await PaymentRepository.instance.update(payment.id, payment);
        } catch (error) {
            throw new Error(`Failed to process payment: ${error}`);
        }
    }

    async refundPayment(payment: Payment): Promise<Payment> {
        try {
            await payment.refund();
            return await PaymentRepository.instance.update(payment.id, { status: 'refunded' });
        } catch (error) {
            throw new Error(`Failed to refund payment: ${error}`);
        }
    }

    async deletePayment(id: string): Promise<void> {
        try {
            await PaymentRepository.instance.delete(id);
        } catch (error) {
            throw new Error(`Failed to delete payment: ${error}`);
        }
    }
}

export { PaymentController };
