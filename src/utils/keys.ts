import type { InjectionKey } from 'vue';

export const openImageKey: InjectionKey<(src: string, alt: string) => void> =
  Symbol('openImage');
