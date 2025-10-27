import { Dimensions, PixelRatio } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

// Largura de referência do seu dispositivo de desenvolvimento (Poco X6 Pro DP width é aprox. 393)
const DESIGN_WIDTH = 393;
const scale = SCREEN_WIDTH / DESIGN_WIDTH;

/**
 * Escala uma unidade (como tamanho de fonte) baseada na largura da tela.
 * @param size O tamanho em DP (unidade base do design).
 * @returns O tamanho ajustado para a tela atual.
 */
export function sw(size: number) {
  return size * scale;
}

/**
 * Escala o tamanho da fonte, aplicando ajuste de largura e garantindo legibilidade.
 * @param size O tamanho da fonte base.
 * @returns O tamanho da fonte ajustado.
 */
export function fs(size: number) {
  // sw(size): Escala baseada na largura.
  // PixelRatio.getFontScale(): Ajusta com base nas configurações de fonte do usuário (acessibilidade).
  const newSize = size * scale;
  return Math.round(newSize * (1 / PixelRatio.getFontScale())) * PixelRatio.getFontScale();
}
