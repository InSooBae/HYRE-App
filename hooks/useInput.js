import React, { useState } from 'react';

const useInput = initilaValue => {
  const [value, setValue] = useState(initilaValue);
  const onChange = text => {
    setValue(text);
  };

  return { value, onChange };
};

export default useInput;
