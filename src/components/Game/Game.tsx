import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { IFieldListStore } from './fieldListStore';
import { Container } from '@material-ui/core';
import FieldList from './FieldList';

interface GameProps {
  fieldListStore?: IFieldListStore;
}

interface GameState {

}

@inject('fieldListStore')
@observer
class Game extends Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
  }

  render() {
    const fields = this.props.fieldListStore!.getPlayerFields;

    return (
      <Container className="pt-10" component="main" maxWidth="xl">
        <div className="field-wrapper">
          <FieldList fieldListMap={fields} />
        </div>
      </Container>
    );
  }
}

export default Game;
