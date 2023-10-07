import React from "react";

export default class Header extends React.Component {
  constructor(props: any) {
    super(props);

    this.onBtnInputJSONClick = props.onBtnInputJSONClick;
    this.onBtnInputDIRClick = props.onBtnInputDIRClick;
    this.onBtnNextRoundClick = props.onBtnNextRoundClick;
    this.onBtnPreviousRoundClick = props.onBtnPreviousRoundClick;
  }

  render() {
    <div className="hbox centered">
      <button
        id="btnPreviousRound"
        className="btn no-display"
        type="button"
        onClick={this.onBtnPreviousRoundClick}
      >
        Предыдущий раунд
      </button>

      <button
        id="btnInputDIR"
        className="btn"
        type="button"
        onClick={this.onBtnInputDIRClick}
      >
        Выбрать папку
      </button>

      <button
        id="btnInputJSON"
        className="btn"
        type="button"
        onClick={this.onBtnInputJSONClick}
      >
        Выбрать сценарий
        <input
          className="no-display"
          id="inputJSON"
          type="file"
          accept=".json"
        />
      </button>

      <button
        id="btnNextRound"
        className="btn"
        type="button"
        onClick={this.onBtnNextRoundClick}
      >
        {this.currentRound === -1 ? "Начать" : "Следующий раунд"}
      </button>
    </div>;
  }
}
