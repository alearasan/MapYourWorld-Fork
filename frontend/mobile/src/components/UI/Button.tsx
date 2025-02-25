/**
 * Componente Button
 * Botón estilizado con Tailwind CSS que soporta diferentes variantes y tamaños
 */
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';

// Aplicamos styled a los componentes nativos
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  className = '',
}) => {
  // Clases base para todos los botones
  const baseClasses = 'rounded-lg font-medium flex-row items-center justify-center';
  
  // Clases específicas para cada variante
  const variantClasses = {
    primary: 'bg-primary-500 text-white active:bg-primary-600',
    secondary: 'bg-secondary-500 text-white active:bg-secondary-600',
    outline: 'bg-transparent border border-primary-500 text-primary-500',
    danger: 'bg-red-500 text-white active:bg-red-600',
  };
  
  // Clases específicas para cada tamaño
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  // Clases para cuando el botón está deshabilitado
  const disabledClasses = disabled 
    ? 'opacity-50' 
    : '';
  
  // Clases para ancho completo
  const widthClasses = fullWidth 
    ? 'w-full' 
    : '';
  
  // Combina todas las clases
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${className}`;
  
  // Color del texto dependiendo de la variante
  const textColor = variant === 'outline' ? 'text-primary-500' : 'text-white';
  
  // Tamaño del texto basado en el tamaño del botón
  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <StyledTouchableOpacity
      className={buttonClasses}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size={size === 'lg' ? 'large' : 'small'}
          color={variant === 'outline' ? '#3B82F6' : '#FFFFFF'}
          style={{ marginRight: icon ? 8 : 0 }}
        />
      ) : icon ? (
        <>{icon}</>
      ) : null}
      
      <StyledText className={`${textColor} ${textSize[size]} font-medium text-center`}>
        {title}
      </StyledText>
    </StyledTouchableOpacity>
  );
}; 