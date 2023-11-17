/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Alert, Linking, SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const {hasPermission, requestPermission} = useCameraPermission();

  React.useEffect(() => {
    (async () => {
      const permission = await requestPermission();
      console.log('permission', permission);
    })();
  }, []);
  const device = useCameraDevice('back');

  if (device == null) return <></>;
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      console.log(codes)
      Alert.alert('Scanned', codes[0].data, [
        {
          text: 'OK',
          onPress: () => {
            Linking.openURL(codes[0].value);
          },
        },
      ]);
    }
  })

  return (
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
        // accessibilityElementsHidden={true}
      />
  );
}

export default App;
