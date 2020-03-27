// custom Text.js
import React, { Component } from 'react';
import { Text as BaseText } from 'react-native';

export default class Text extends Component {
  render() {
    return <BaseText allowFontScaling={false} {...this.props} />;
  }
}

// or if you prefer a functional component:
