import React, { Component } from 'react';

interface FieldProps {
  fieldId: string;
  isShip: boolean;
  isHit: boolean;
}

class Field extends Component<FieldProps, {}> {
  constructor(props: FieldProps) {
    super(props);
  }

  render() {
    return (
      <div className="field">
        {this.props.fieldId[0]}
        <span />
      </div>
    );
  }
}

export default Field;
