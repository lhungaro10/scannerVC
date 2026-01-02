import React, { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LANDSCAPE_RIGHT, OrientationLocker } from 'react-native-orientation-locker';
import { Camera, useCameraDevice, useCodeScanner, useCameraPermission, type Code, type CameraDeviceFormat } from 'react-native-vision-camera';
import { CodebarMask } from './CodebarMask';
import { barcodeToDigitableLine } from '../utils/boleto';


type ScannerVCProps = {
    onClose: () => void;
};

export const ScannerVC = ({ onClose }: ScannerVCProps) => {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const lastScannedValue = useRef<string | null>(null);
    const format: CameraDeviceFormat | undefined = useMemo(() => {
        if (!device) return undefined;
        // Pick a format that supports higher fps (30) and prefers higher resolution for better quality.
        const formats = device.formats
            .filter(f => f.maxFps >= 30 && f.minFps <= 30 && f.videoWidth != null && f.videoHeight != null)
            .sort((a, b) => {
                // Prioritize higher video resolution (width * height)
                const areaA = (a.videoWidth ?? 0) * (a.videoHeight ?? 0);
                const areaB = (b.videoWidth ?? 0) * (b.videoHeight ?? 0);
                return areaB - areaA;
            });
        return formats[0] ?? device.formats[0]; // Fallback to first available format
    }, [device]);
    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    const onCodesDetected = (code?: Code) => {
        if(!code){
            return;
        }
        const codeValue = code.value ?? '';
        console.log('Detected code:', codeValue);

        if (codeValue.length !== 44) {
            return;
        }

        lastScannedValue.current = codeValue;

        Alert.alert('Código Escaneado', `Código: ${barcodeToDigitableLine(codeValue)}`, [
            {
                text: 'OK',
                onPress: () => {
                    lastScannedValue.current = null;
                },
            },
        ]);
    };

    const codeScanner = useCodeScanner({
        codeTypes: ['itf'],
        onCodeScanned: (codes) => onCodesDetected(codes[0]),
    });

    if (!hasPermission || !device) {
        return (
            <View style={styles.centeredFallback}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.fallbackText}>Inicializando câmera...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <OrientationLocker orientation={LANDSCAPE_RIGHT} />
            <Camera
                format={format}
                fps={10}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive
                codeScanner={codeScanner}
                photoQualityBalance="quality"
                videoStabilizationMode="auto"
                enableZoomGesture
            />
            <CodebarMask />

            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
                <Text style={styles.closeLabel}>Fechar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        flex: 1,
        backgroundColor: '#000',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.65)',
        borderRadius: 999,
    },
    closeLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    centeredFallback: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    fallbackText: {
        marginTop: 12,
        color: '#fff',
        fontSize: 16,
    },
});
