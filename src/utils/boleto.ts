/**
 * Calcula o dígito verificador usando módulo 10
 */
function calculateMod10(sequence: string): number {
	let sum = 0;
	let multiplier = 2;

	for (let i = sequence.length - 1; i >= 0; i--) {
		const digit = parseInt(sequence[i], 10);
		const result = digit * multiplier;
		sum += result > 9 ? Math.floor(result / 10) + (result % 10) : result;
		multiplier = multiplier === 2 ? 1 : 2;
	}

	const remainder = sum % 10;
	return remainder === 0 ? 0 : 10 - remainder;
}

/**
 * Converte código de barras ITF (44 dígitos) em linha digitável de boleto brasileiro (47 dígitos)
 * 
 * @param barcode - Código de barras com 44 dígitos
 * @returns Linha digitável formatada ou null se o código for inválido
 */
export function barcodeToDigitableLine(barcode: string): string | null {
	// Remove espaços e caracteres não numéricos
	const cleanBarcode = barcode.replace(/\D/g, '');

	// Valida se tem exatamente 44 dígitos
	if (cleanBarcode.length !== 44) {
		return null;
	}

	// Extrai as partes do código de barras
	const bankCode = cleanBarcode.substring(0, 3); // Posições 1-3
	const currencyCode = cleanBarcode.substring(3, 4); // Posição 4
	const dvGeneral = cleanBarcode.substring(4, 5); // Posição 5 (DV geral)
	const dueDate = cleanBarcode.substring(5, 9); // Posições 6-9
	const value = cleanBarcode.substring(9, 19); // Posições 10-19
	const freeField = cleanBarcode.substring(19, 44); // Posições 20-44

	// Campo 1: AAABC.CCCCX
	// AAA = código do banco, B = código da moeda, CCCC = primeiras 4 posições do campo livre, X = DV
	const field1Base = bankCode + currencyCode + freeField.substring(0, 5);
	const field1DV = calculateMod10(field1Base);
	const field1 = `${field1Base.substring(0, 5)}.${field1Base.substring(5)}${field1DV}`;

	// Campo 2: CCCCC.CCCCCY
	// 10 posições do campo livre (5-14), Y = DV
	const field2Base = freeField.substring(5, 15);
	const field2DV = calculateMod10(field2Base);
	const field2 = `${field2Base.substring(0, 5)}.${field2Base.substring(5)}${field2DV}`;

	// Campo 3: CCCCC.CCCCZ
	// 10 posições do campo livre (15-24), Z = DV
	const field3Base = freeField.substring(15, 25);
	const field3DV = calculateMod10(field3Base);
	const field3 = `${field3Base.substring(0, 5)}.${field3Base.substring(5)}${field3DV}`;

	// Campo 4: K
	// DV geral do código de barras
	const field4 = dvGeneral;

	// Campo 5: UUUUVVVVVVVVVV
	// UUUU = fator de vencimento, VVVVVVVVVV = valor
	const field5 = dueDate + value;

	// Retorna linha digitável formatada
	return `${field1} ${field2} ${field3} ${field4} ${field5}`;
}

/**
 * Converte código de barras ITF em linha digitável sem formatação (apenas números)
 */
export function barcodeToDigitableLineRaw(barcode: string): string | null {
	const formatted = barcodeToDigitableLine(barcode);
	return formatted ? formatted.replace(/\D/g, '') : null;
}
