/**
 * Utilidades de cifrado para el cliente web
 * Implementa funciones de cifrado AES y hashing para el frontend
 */

import CryptoJS from 'crypto-js';

/**
 * Cifra un texto usando AES
 * @param text Texto a cifrar
 * @param key Clave de cifrado (opcional)
 * @returns Texto cifrado en formato Base64
 */
export function encryptAES(text: string, key?: string): string {
  try {
    // Si no se proporciona clave, usar clave por defecto (solo para desarrollo)
    const encryptionKey = key || 'default_key_for_development_only';
    
    // Cifrar el texto usando AES
    const encrypted = CryptoJS.AES.encrypt(text, encryptionKey);
    
    // Devolver el resultado como string en formato Base64
    return encrypted.toString();
  } catch (error) {
    console.error('Error al cifrar con AES:', error);
    throw new Error('No se pudo cifrar el texto');
  }
}

/**
 * Descifra un texto cifrado con AES
 * @param encryptedText Texto cifrado en formato Base64
 * @param key Clave de cifrado (opcional)
 * @returns Texto descifrado
 */
export function decryptAES(encryptedText: string, key?: string): string {
  try {
    // Si no se proporciona clave, usar clave por defecto (solo para desarrollo)
    const encryptionKey = key || 'default_key_for_development_only';
    
    // Descifrar el texto usando AES
    const decrypted = CryptoJS.AES.decrypt(encryptedText, encryptionKey);
    
    // Convertir bytes a UTF-8
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error al descifrar con AES:', error);
    throw new Error('No se pudo descifrar el texto');
  }
}

/**
 * Genera un hash SHA-256 de un texto
 * @param text Texto a hashear
 * @returns Hash SHA-256 en formato hexadecimal
 */
export function generateSHA256(text: string): string {
  return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
}

/**
 * Genera un hash SHA-512 de un texto
 * @param text Texto a hashear
 * @returns Hash SHA-512 en formato hexadecimal
 */
export function generateSHA512(text: string): string {
  return CryptoJS.SHA512(text).toString(CryptoJS.enc.Hex);
}

/**
 * Genera un token seguro aleatorio
 * @param length Longitud del token (por defecto 32)
 * @returns Token aleatorio en formato hexadecimal
 */
export function generateRandomToken(length = 32): string {
  // Generar bytes aleatorios
  const randomBytes = CryptoJS.lib.WordArray.random(length / 2);
  
  // Convertir a formato hexadecimal
  return randomBytes.toString(CryptoJS.enc.Hex);
}

/**
 * Verifica si un token o cadena ha expirado
 * @param token Token a verificar
 * @param expirationKey Clave que contiene la fecha de expiración
 * @returns true si el token ha expirado, false en caso contrario
 */
export function isTokenExpired(token: string, expirationKey = 'exp'): boolean {
  try {
    // Decodificar el token (asumiendo formato JWT)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const decoded = JSON.parse(jsonPayload);
    
    // Verificar si tiene fecha de expiración
    if (!decoded[expirationKey]) {
      return false;
    }
    
    // Comparar con la fecha actual (en segundos)
    const now = Math.floor(Date.now() / 1000);
    return decoded[expirationKey] < now;
  } catch (error) {
    console.error('Error al verificar expiración del token:', error);
    // Si hay error al decodificar, considerarlo como expirado
    return true;
  }
} 