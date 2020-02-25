import { Segment, Button, Text } from 'native-base';
import React from 'react';

const HeaderButton = ({ value1, value2, onPress1, onPress2, query }) => (
  <Segment>
    <Button first active={query === value1 ? true : false} onPress={onPress1}>
      <Text>{value1}</Text>
    </Button>
    <Button last active={query === value2 ? true : false} onPress={onPress2}>
      <Text>{value2}</Text>
    </Button>
  </Segment>
);

export default HeaderButton;
