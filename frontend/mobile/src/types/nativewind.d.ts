/// <reference types="nativewind/types" />

declare module 'nativewind' {
  import type { ViewProps } from 'react-native';
  import type { ComponentType } from 'react';

  export interface StyledProps {
    className?: string;
  }

  export type StyledComponent<T> = ComponentType<T & StyledProps>;

  export function styled<T>(component: ComponentType<T>): StyledComponent<T>;
  
  export function StyledComponent<T>(props: T & StyledProps): JSX.Element;
} 