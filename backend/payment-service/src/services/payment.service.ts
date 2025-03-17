import PaymentRepository from '../repositories/payment.repository';
import { Payment } from '../models/payment.model';

const paymentRepo = new PaymentRepository();

/**
 * Crea un nuevo pago
 * @param paymentData Datos del pago a crear
 */
export const createPayment = async (paymentData: Omit<Payment, 'id'>): Promise<Payment> => {
    return await paymentRepo.createPayment(paymentData);
};

/**
 * Obtiene un pago por su ID
 * @param id ID del pago
 */
export const findPaymentById = async (id: string): Promise<Payment | null> => {
    return await paymentRepo.getById(id);
};

/**
 * Obtiene todos los pagos
 */
export const findAllPayments = async (): Promise<Payment[]> => {
    return await paymentRepo.getAll();
};

/**
 * Actualiza un pago existente
 * @param id ID del pago a actualizar
 * @param updateData Datos a actualizar del pago
 */
export const updatePayment = async (id: string, updateData: Partial<Payment>): Promise<Payment | null> => {
    return await paymentRepo.updatePayment(id, updateData);
};

/**
 * Elimina un pago por su ID
 * @param id ID del pago a eliminar
 */
export const deletePayment = async (id: string): Promise<boolean> => {
    return await paymentRepo.deletePayment(id);
};
