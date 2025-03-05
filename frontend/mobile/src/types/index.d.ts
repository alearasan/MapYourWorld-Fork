/// <reference types="nativewind/types" />

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';

declare module 'nativewind' {
  import type { ComponentType } from 'react';
  
  export interface StyledProps {
    className?: string;
  }
  
  export type StyledComponent<P> = ComponentType<P & StyledProps>;
  
  export function styled<P>(component: ComponentType<P>): StyledComponent<P>;
} 