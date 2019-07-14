import React, { Component } from 'react';

interface FieldProps {
  fieldId: string;
  isShip: boolean;
  isAccessed: boolean;
  isHit: boolean;
  isPlayer: boolean;
}

interface FieldState {
  fade: boolean,
}

class Field extends Component<FieldProps, FieldState> {
  constructor(props: FieldProps) {
    super(props);
    this.state = { fade: false }
  }

  render() {
    const fade = this.state.fade;

    if (this.props.isHit) {
      return (
        <div className="field-hit">
          {this.props.fieldId[0]}
          <span />
        </div>
      );
    }

    if (this.props.isAccessed) {
      return (
        <div className="field-sea">
          {this.props.fieldId[0]}
          <span />
        </div>
      );
    }

    if (this.props.isShip) {
      return (
        <div
          onClick={() => this.setState({ fade: true })}
          onAnimationEnd={() => this.setState({ fade: false })}
          className={fade ? 'field-ship fade' : 'field-ship'}>
          {this.props.fieldId[0]}
          <span />
        </div>
      )
    }

    if (this.props.isPlayer) {
      return (
        <div
          onClick={() => this.setState({ fade: true })}
          onAnimationEnd={() => this.setState({ fade: false })}
          className={fade ? 'field-player fade' : 'field-player'}>
          {this.props.fieldId[0]}
          <span />
        </div>
      );
    }

    return (
      <div
        onClick={() => this.setState({ fade: true })}
        onAnimationEnd={() => this.setState({ fade: false })}
        className={fade ? 'field-opponent fade' : 'field-opponent'}>
        {this.props.fieldId[0]}
        <span />
      </div>
    );
  }
}

export default Field;
