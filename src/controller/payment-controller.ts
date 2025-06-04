import { CardPayment } from "../models/card-payment";
import { CashPayment } from "../models/cash-payment";
import type { Payment, JointPayment } from "../models/payment";
import { PaymentRepository } from "../repository/payment-repository";

type FormValidation = {
    visaNumber?: string;
    creditNumber?: string;
    mastercardNumber?: string;
}
const validateVisa = (cardNumber: string):boolean => {
    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    return visaRegex.test(cardNumber)
}

const validateCredit = (cardNumber: string):boolean => {
    const creditRegex = /^\d{13,16}$/;
    return creditRegex.test(cardNumber)
}

const validateMastercard = (cardNumber: string):boolean => {
    const mastercardRegex = /^5[1-5][0-9]{14}$|^2[2-7][0-9]{14}$/;
    return mastercardRegex.test(cardNumber)
}
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

    createPaymentObject(data: Partial<JointPayment>): Payment {
        try {
            const { type, amount, status, cardNumber, expiryDate, paymentGateway } = data;

            if (type === 'card') {
                if (!cardNumber || !expiryDate || !paymentGateway) {
                    throw new Error('Card details are required for card payments');
                }
                return new CardPayment(
                    null,
                    amount || 0,
                    new Date(),
                    status || 'pending',
                    cardNumber,
                    expiryDate,
                    paymentGateway
                );
            } else if (type === 'cash') {
                if (cardNumber || expiryDate || paymentGateway) {
                    throw new Error('Card details should not be provided for cash payments');
                }
                return new CashPayment(
                    null,
                    amount || 0,
                    new Date(),
                    status || 'pending'
                );
            } else {
                throw new Error(`Unknown payment type ${type}`);
            }
        } catch (error) {
            throw new Error(`Failed to create payment object: ${error}`);
        }
    }

    async storePayment(payment: Payment): Promise<Payment> {
        try {
            return await PaymentRepository.instance.create(
                payment.amount,
                payment.status,
                payment instanceof CardPayment ? 'card' : 'cash',
                payment instanceof CardPayment ? payment.cardNumber : undefined,
                payment instanceof CardPayment ? payment.expiryDate : undefined,
                payment instanceof CardPayment ? payment.paymentGateway : undefined
            );
        } catch (error) {
            throw new Error(`Failed to store payment: ${error}`);
        }
    }

    async createPayment(data: Partial<JointPayment>): Promise<Payment> {
        try {
            const paymentObject = this.createPaymentObject(data);
            return await this.storePayment(paymentObject);
        } catch (error) {
            throw new Error(`Failed to create payment: ${error}`);
        }
    }

    async updatePayment(id: string, data: Partial<JointPayment>): Promise<Payment> {
        try {
            return await PaymentRepository.instance.update(id, data);
        } catch (error) {
            throw new Error(`Failed to update payment: ${error}`);
        }
    }

    async processPayment(payment: Payment): Promise<Payment> {
        try {
            if (!payment.id) {
                throw new Error('Payment ID is required for processing');
            }
            await payment.process();
            return await PaymentRepository.instance.update(payment.id, {
                id: payment.id || undefined,
                amount: payment.amount,
                date: payment.date,
                status: payment.status,
                ...(payment instanceof CardPayment && {
                    cardNumber: payment.cardNumber,
                    expiryDate: payment.expiryDate,
                    paymentGateway: payment.paymentGateway
                })
            });
        } catch (error) {
            throw new Error(`Failed to process payment: ${error}`);
        }
    }

    async refundPayment(payment: Payment): Promise<Payment> {
        try {
            if (!payment.id) {
                throw new Error('Payment ID is required for refund');
            }
            await payment.refund();
            return await PaymentRepository.instance.update(payment.id, { status: 'refunded' });
        } catch (error) {
            throw new Error(`Failed to refund payment: ${error}`);
        }
    }

    validateField (paymentMethod: string, value: string):string {
        switch(paymentMethod){
            case 'Visa':
                if (!value.trim()) return 'Card number is required'
                if (!validateVisa(value)) return 'Visa number is in wrong format'
                return "";
            case 'Credit Card':
                if(!value.trim()) return 'Card number is required'
                if (!validateCredit(value)) return 'Credit number is in wrong format'
                return "";
            case 'Mastercard':
                if (!value.trim()) return 'Card number is required'
                if(!validateMastercard(value)) return 'Mastercard number is in wrong format'
                return "";
            default:
                return "";
        }
    }

    validateForm(data: FormValidation):FormValidation {
        return {
            visaNumber: data.visaNumber !== undefined ? this.validateField('Visa', data.visaNumber) : "",
            creditNumber: data.creditNumber !== undefined ? this.validateField('Credit Card', data.creditNumber): "",
            mastercardNumber: data.mastercardNumber !== undefined ? this.validateField('Mastercard', data.mastercardNumber) : ""
        }
    }
}

export { PaymentController };
