import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  Alert,
  Text,

} from 'react-native';
import {

  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { ScannerVC } from './components/ScannerVC';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';

function App(): React.JSX.Element {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  useEffect(() => {
    requestCameraPermission();
  });

  const requestCameraPermission = async () => {
    try {
      const permission = await requestPermission();
      if (!permission) {
        Alert.alert(
          'Permissão Negada',
          'A permissão de câmera é necessária para usar este aplicativo.',
          [{ text: 'OK' }],
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao solicitar permissão de câmera');
      console.error('Camera permission error:', error);
    }
  };

  const handleOpenCamera = () => {
    if (hasPermission) {
      setIsCameraOpen(true);
      Alert.alert('Câmera', 'Câmera aberta com sucesso!');
    } else {
      requestCameraPermission();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OrientationLocker orientation={PORTRAIT} />

      <View style={styles.content}>
        <Text style={styles.title}>Scanner Camera</Text>
        <Text style={styles.subtitle}>
          {hasPermission
            ? 'Permissão de câmera concedida'
            : 'Aguardando permissão de câmera'}
        </Text>


        {device && hasPermission && (
          <View style={styles.cameraPreview}>
            <Button
              title={hasPermission ? 'Abrir Câmera' : 'Permitir Câmera'}
              onPress={handleOpenCamera}
            />
          </View>
        )}
      </View>
      {isCameraOpen && <ScannerVC onClose={() => setIsCameraOpen(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  cameraPreview: {
    width: 300,
    height: 400,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default App;
