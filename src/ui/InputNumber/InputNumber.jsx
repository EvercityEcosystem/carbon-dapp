import React, { useState, useEffect } from "react";

import { Input } from "antd";

const InputNumber = React.forwardRef(
  ({ value: defaultValue, onChange, step, ...restProps }, ref) => {
    const [state, setState] = useState(defaultValue);

    useEffect(() => setState(defaultValue), [defaultValue]);

    return (
      <Input
        {...restProps}
        ref={ref}
        type="number"
        step={step || "any"}
        value={state}
        onChange={e => {
          const value = parseFloat(e.target.value);
          onChange(value);
          setState(value);
        }}
      />
    );
  },
);

InputNumber.defaultProps = {
  onChange: () => {},
  step: null,
};

export default InputNumber;
