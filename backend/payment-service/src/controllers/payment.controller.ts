import { Request, Response } from 'express';
import * as PaymentService from '../services/payment.service';

/**
 * Crea un nuevo pago.
 */
export const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscription_id, amount, currency, status } = req.body;

    if (!subscription_id || amount === undefined || !currency || !status) {
      res.status(400).json({ success: false, message: 'Faltan datos necesarios para crear el pago' });
      return;
    }

    const newPayment = await PaymentService.createPayment(req.body);
    res.status(201).json({ success: true, message: 'Pago creado correctamente', payment: newPayment });
  } catch (error) {
    console.error('Error al crear el pago:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al crear el pago'
    });
  }
};

/**
 * Obtiene un pago por su ID.
 */
export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const paymentId = req.params.paymentId;
    const payment = await PaymentService.findPaymentById(paymentId);

    if (!payment) {
      res.status(404).json({ success: false, message: 'Pago no encontrado' });
      return;
    }

    res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error('Error al obtener el pago:', error);
    res.status(500).json({ success: false, message: 'Error al obtener el pago' });
  }
};

/**
 * Obtiene todos los pagos.
 */
export const getAllPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const payments = await PaymentService.findAllPayments();
    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    res.status(500).json({ success: false, message: 'Error al obtener los pagos' });
  }
};

/**
 * Actualiza un pago.
 */
export const updatePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const paymentId = req.params.paymentId;
    const updateData = req.body;

    if (!updateData) {
      res.status(400).json({ success: false, message: 'Faltan datos para actualizar el pago' });
      return;
    }

    const updatedPayment = await PaymentService.updatePayment(paymentId, updateData);

    if (!updatedPayment) {
      res.status(404).json({ success: false, message: 'Pago no encontrado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Pago actualizado correctamente', payment: updatedPayment });
  } catch (error) {
    console.error('Error al actualizar el pago:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el pago' });
  }
};

/**
 * Elimina un pago.
 */
export const deletePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const paymentId = req.params.paymentId;
    const result = await PaymentService.deletePayment(paymentId);

    if (!result) {
      res.status(404).json({ success: false, message: 'Pago no encontrado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Pago eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el pago:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el pago' });
  }
};

