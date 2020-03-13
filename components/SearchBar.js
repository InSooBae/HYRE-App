import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';
import styles from '../styles';
import { TextInput } from 'react-native';

const SearchBar = ({ onChange, value, onSubmit }) => (
  <TextInput
    selectionColor={'#696969'}
    style={{
      marginLeft: 10,
      width: constants.width - 100,
      height: 40,
      backgroundColor: '#F0F0F0',
      borderRadius: 5,
      textAlign: 'left',
      fontSize: 21,
      color: '#696969'
    }}
    returnKeyType="search"
    onChangeText={onChange}
    onEndEditing={onSubmit}
    value={value}
    autoCapitalize="none"
    autoCorrect={false}
    placeholder={'이름,회사명 등 검색'}
    placeholderTextColor={styles.darkGreyColor}
    autoFocus={true}
  />
  // <Searchbar
  //   selectionColor={styles.hanyangColor}
  //   style={{
  //     width: constants.width / 1.1,
  //     backgroundColor: styles.greyColor,
  //     borderColor: styles.hanyangColor,
  //     borderWidth: 1
  //   }}
  //   theme={{
  //     colors: {
  //       primary: styles.redColor,
  //       text: styles.hanyangColor
  //     },
  //     roundness: 30
  //   }}
  //   placeholder="Search"
  //   returnKeyType="search"
  //   onChangeText={onChange}
  //   onSubmitEditing={onSubmit}
  //   value={value}
  //   autoCorrect={false}
  //   autoCapitalize="none"
  // />
);

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default SearchBar;
