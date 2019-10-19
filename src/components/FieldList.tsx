import React, { Component } from 'react';
import Field from './Field';
import { inject, observer } from 'mobx-react';
import { FieldListStore } from './Game/fieldListStore';

interface FieldListProps {
  isPlayer: boolean;
  fieldListStore?: FieldListStore;
}

@inject('fieldListStore')
@observer
class FieldList extends Component<FieldListProps, {}> {
  constructor(props: FieldListProps) {
    super(props);
  }

  render() {
    if (this.props.isPlayer) {
      return this.props.fieldListStore!.playerFieldList.map((field) => (
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
    return this.props.fieldListStore!.opponentFieldList.map((field) => (
      <Field
        key={field.fieldId}
        fieldId={field.fieldId}
        isHit={field.isHit}
        isShip={field.isShip}
        isPlayer={field.isPlayer}
        isAccessed={field.isAccessed}
      />
    ));
  }
}

export default FieldList;
