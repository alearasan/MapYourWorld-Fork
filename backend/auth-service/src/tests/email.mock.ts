import { EmailOptions, EmailResult, sendVerificationEmail, sendPasswordResetEmail, sendPasswordChangeNotification } from '../services/email.service';

// para probar el mock:
// cd backend/auth-service
// desde terminal: npx ts-node -r tsconfig-paths/register src/tests/email.mock.ts
const nodemailer = require('nodemailer');
nodemailer.createTransport = () => {
  console.log('nodemailer.createTransport overridden with mock transporter.');
  return {
    verify: async (): Promise<boolean> => {
      console.log('Mock transporter.verify called.');
      return new Promise((resolve) => setTimeout(() => resolve(true), 300));
    },
    sendMail: async (options: EmailOptions): Promise<EmailResult> => {
      console.log('Mock transporter.sendMail called with:');
      console.log(JSON.stringify(options, null, 2));
      return new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            success: true,
            messageId: 'mock-verification-message-id-456'
          });
        }, 500)
      );
    }
  };
};

// sendEmail
export const mockSendEmail = async (options: EmailOptions): Promise<EmailResult> => {
  console.log('Mock sendEmail llamado con:');
  console.log(JSON.stringify(options, null, 2));

  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        success: true,
        messageId: 'mock-verification-message-id-456'
      });
    }, 500)
  );
};

// sendVerificationEmail
async function runServiceVerificationEmailTest() {  
    const result = await sendVerificationEmail('usuario@example.com', 'Usuario', 'token-123');
    console.log('Resultado de sendVerificationEmail del servicio:', result);
}

// sendPasswordResetEmail
async function runSendPasswordResetEmail() {
    const res = await sendPasswordResetEmail('usuario@example.com', 'Usuario', 'token-123');
    console.log('Resultado de sendPasswordResetEmail:', res);
}

// sendPasswordChangeNotification
async function runSendPasswordChangeNotification() {
    const res = await sendPasswordChangeNotification('usuario@example.com', 'Usuario');
    console.log('Resultado de sendPasswordResetEmail:', res);
}
// testEmailConnection
async function runTestEmailConnection() {
    const transporter = nodemailer.createTransport();
    const result = await transporter.verify();
    console.log('Resultado de la verificación de correo:', result);
}

// Ejemplo de prueba del mock
async function runMockTest() {
  const testOptions: EmailOptions = {
    to: 'usuario@example.com',
    subject: 'Correo de Prueba',
    html: '<p>Este es un correo de prueba enviado desde el mock.</p>',
    text: 'Este es un correo de prueba enviado desde el mock.'
  };
  try {
    const result = await mockSendEmail(testOptions);
    console.log('Resultado del envío simulado:', result);
  } catch (error) {
    console.error('Error en el mock:', error);
  }
}

runMockTest();
runServiceVerificationEmailTest();
runSendPasswordResetEmail();
runSendPasswordChangeNotification();
runTestEmailConnection();