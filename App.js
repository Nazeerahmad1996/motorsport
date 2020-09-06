import React, { Component } from 'react';
import { StyleSheet, Text, View, BackHandler, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

export default class App extends Component {

  constructor() {
    super()
    this.state = {
      pdf: false,
      urlPdf: ''
    }
  }

  webView = {
    canGoBack: false,
    ref: null,
  }
  onAndroidBackPress = () => {
    if (this.webView.canGoBack && this.webView.ref) {
      this.webView.ref.goBack();
      return true;
    }
    return false;
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  handleWebViewNavigationStateChange = newNavState => {

    this.webView.canGoBack = newNavState.canGoBack
    const { url } = newNavState;

    if (!url) return;
    console.log(url)
    if (url.includes('?message=success')) {
      this.webview.stopLoading();
      // maybe close this view?
    }

    // one way to handle errors is via query string
    if (url.includes('?errors=true')) {
      this.webview.stopLoading();
    }
  };


  openExternalLink(req) {
    const isLocal = req.url.search('https://motorsportmonday.com/app/') !== -1;

    if (isLocal) {
      return true;
    } else {
      Linking.openURL(req.url);
      return false;
    }
  }



  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', paddingTop: 15 }}>
            <WebView
              ref={(webView) => { this.webView.ref = webView; }}
              onNavigationStateChange={this.handleWebViewNavigationStateChange}
              onShouldStartLoadWithRequest={this.openExternalLink}
              // onNavigationStateChange={(navState) => { this.webView.canGoBack = navState.canGoBack; }}
              style={styles.container}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              useWebKit={true}
              cacheEnabled={false}
              onLoadProgress={e => console.log(e.nativeEvent.progress)}
              allowsBackForwardNavigationGestures={true}
              originWhitelist={['*']}
              mixedContentMode="always"
              allowFileAccess={true}
              allowUniversalAccessFromFileURLs={true}
              onError={syntheticEvent => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
              }}
              source={{ uri: 'https://motorsportmonday.com/app/' }}
            >
            </WebView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
