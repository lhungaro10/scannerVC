import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

type CodebarMaskProps = {
	width?: number;
	height?: number;
	label?: string;
};

export const CodebarMask = ({
	width,
	height,
	label = 'Aponte o código aqui',
}: CodebarMaskProps) => {
	const { width: screenWidth, height: screenHeight } = useWindowDimensions();
	const defaultWidth = screenWidth * 0.9;
	const defaultHeight = screenHeight * 0.32;
	const boxWidth = Math.min(width ?? defaultWidth, screenWidth * 0.98);
	const boxHeight = Math.min(height ?? defaultHeight, screenHeight * 0.95);
	const horizontal = Math.max((screenWidth - boxWidth) / 2, 8);
	const vertical = (screenHeight - boxHeight) / 2;

	return (
		<View pointerEvents="none" style={styles.container}>
			<View style={[styles.overlay, { top: 0, left: 0, right: 0, height: vertical }]} />
			<View style={[styles.overlay, { top: vertical, left: 0, width: horizontal, height: boxHeight }]} />
			<View style={[styles.overlay, { top: vertical, right: 0, width: horizontal, height: boxHeight }]} />
			<View style={[styles.overlay, { bottom: 0, left: 0, right: 0, height: vertical }]} />

			<View style={[styles.window, { width: boxWidth, height: boxHeight, top: vertical, left: horizontal }]}>
				<View style={[styles.corner, styles.topLeft]} />
				<View style={[styles.corner, styles.topRight]} />
				<View style={[styles.corner, styles.bottomLeft]} />
				<View style={[styles.corner, styles.bottomRight]} />
			</View>

			{label ? <Text style={styles.label}>{label}</Text> : null}
		</View>
	);
};

const BORDER = 4;

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	overlay: {
		position: 'absolute',
		backgroundColor: 'rgba(0,0,0,0.55)',
	},
	window: {
		position: 'absolute',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.08)',
	},
	corner: {
		position: 'absolute',
		width: 32,
		height: 32,
		borderColor: '#00E0A1',
	},
	topLeft: {
		top: -BORDER,
		left: -BORDER,
		borderTopWidth: BORDER,
		borderLeftWidth: BORDER,
		borderTopLeftRadius: 10,
	},
	topRight: {
		top: -BORDER,
		right: -BORDER,
		borderTopWidth: BORDER,
		borderRightWidth: BORDER,
		borderTopRightRadius: 10,
	},
	bottomLeft: {
		bottom: -BORDER,
		left: -BORDER,
		borderBottomWidth: BORDER,
		borderLeftWidth: BORDER,
		borderBottomLeftRadius: 10,
	},
	bottomRight: {
		bottom: -BORDER,
		right: -BORDER,
		borderBottomWidth: BORDER,
		borderRightWidth: BORDER,
		borderBottomRightRadius: 10,
	},
	label: {
		position: 'absolute',
		bottom: 36,
		alignSelf: 'center',
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
		paddingHorizontal: 16,
		textAlign: 'center',
	},
});
