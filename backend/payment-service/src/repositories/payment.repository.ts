import { Repository } from 'typeorm';
import { Payment } from '../models/payment.model'; // Importa tu entidad
import { AppDataSource } from '../../../database/appDataSource'; // Importa la instancia de conexión

export default class PaymentRepository {
    private paymentRepo: Repository<Payment>;

    constructor() {
        this.paymentRepo = AppDataSource.getRepository(Payment);
    }

    async getAll(): Promise<Payment[]> {
        return await this.paymentRepo.find();
    }

    async getById(id: string): Promise<Payment> {
        const payment = await this.paymentRepo.findOneBy({ id });
        if (!payment) {
            throw new Error(`Payment with id ${id} not found`);
        }
        return payment;
    }

    async createPayment(paymentData: Omit<Payment, 'id'>): Promise<Payment> {
        const newPayment = this.paymentRepo.create(paymentData);
        return await this.paymentRepo.save(newPayment);
    }

    async updatePayment(id: string, updateData: Partial<Payment>): Promise<Payment> {
        const payment = await this.getById(id);
        Object.assign(payment, updateData);
        return await this.paymentRepo.save(payment);
    }

    async deletePayment(id: string): Promise<boolean> {
        const result = await this.paymentRepo.delete(id);
        return result.affected !== 0;
    }

    async getByStatus(status: string): Promise<Payment[]> {
        return await this.paymentRepo.find({ where: { status } });
    }

    async getBySubscriptionId(subscriptionId: string): Promise<Payment[]> {
        return await this.paymentRepo.find({ where: { subscription_id: subscriptionId } });
    }
}
