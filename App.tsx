/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef } from 'react';
import {Alert, Image, Linking, SafeAreaView, StyleSheet, Text, View, useColorScheme} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import * as tf from '@tensorflow/tfjs';
import {fetch, decodeJpeg} from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const {hasPermission, requestPermission} = useCameraPermission();
  const [isTfReady, setIsTfReady] = React.useState(false);
  const [result, setResult] = React.useState<string>("");
  const image = useRef(null)

  const load = async () => {
    try {
      await tf.ready();
      const model = await mobilenet.load();
      setIsTfReady(true);

      const image = require('./basketball.jpg');
      const imageAssetPath = Image.resolveAssetSource(image);
      const response = await fetch(imageAssetPath.uri, {}, {isBinary: true});
      const imageDataArrayBuffer = await response.arrayBuffer();
      const imageData = new Uint8Array(imageDataArrayBuffer);
      const imageTensor = decodeJpeg(imageData);
      const prediction = await model.classify(imageTensor);
      if(prediction && prediction.length > 0) {
        setResult(
          `${prediction[0].className} (${prediction[0].probability.toFixed(3)})`
        )
      }
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  // React.useEffect(() => {
  //   (async () => {
  //     const permission = await requestPermission();
  //     console.log('permission', permission);
  //   })();
  // }, []);
  // const device = useCameraDevice('back');

  // if (device == null) return <></>;
  // const codeScanner = useCodeScanner({
  //   codeTypes: ['qr', 'ean-13'],
  //   onCodeScanned: (codes) => {
  //     console.log(codes)
  //     Alert.alert('Scanned', codes[0].data, [
  //       {
  //         text: 'OK',
  //         onPress: () => {
  //           Linking.openURL(codes[0].value);
  //         },
  //       },
  //     ]);
  //   }
  // })

  return (
      <View style={styles.container}>
        <Image 
          ref={image}
          source={require('./basketball.jpg')}
          style={{width: 200, height: 200}}
        />
        {!isTfReady && <Text>Loading TensorFlow mode...</Text>}
        {isTfReady && result === '' && <Text>Classifying...</Text>}
        {result !== '' && <Text>{result}</Text>}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});

export default App;
