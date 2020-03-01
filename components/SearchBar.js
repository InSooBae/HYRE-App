import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';
import styles from '../styles';
import { Header, Item, Icon, Input, Button, Text } from 'native-base';
import { Platform } from 'react-native';

const TextInput = styled.TextInput``;

const SearchBar = ({ onChange, value, onSubmit }) => (
  <Header
    style={
      Platform.OS === 'ios'
        ? { width: constants.width, backgroundColor: 'white' }
        : { width: constants.width, backgroundColor: 'white' }
    }
    searchBar
    rounded
  >
    <Item>
      <Icon name="ios-search" />
      <Input
        placeholder="Search"
        returnKeyType="search"
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        value={value}
        autoCorrect={false}
        autoCapitalize="none"
      />
      <Icon name="ios-people" />
    </Item>
    <Button onPress={onSubmit} transparent>
      <Text>Search</Text>
    </Button>
  </Header>
);

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default SearchBar;
