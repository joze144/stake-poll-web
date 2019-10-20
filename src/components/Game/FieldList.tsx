import React, { Component } from 'react';
import Field from './Field';
import { FieldObject } from './fieldListStore';

interface FieldListProps {
  fieldListMap: FieldObject[];
}

class FieldList extends Component<FieldListProps, {}> {
  constructor(props: FieldListProps) {
    super(props);
  }

  render() {
    return this.props.fieldListMap.map((field) => (
      <Field
        key={field.fieldId}
        fieldId={field.fieldId}
        isHit={field.isHit}
        isPlayer={field.isPlayer}
        isAccessed={field.isAccessed}
        isShip={field.isShip}
      />
    ));
  }
}

export default FieldList;
