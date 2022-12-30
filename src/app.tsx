import React from "react";
import { createRoot } from "react-dom/client";
import RoundWidget from "./roundwidget";
import Codes from "./codes";

class Main extends React.Component {
  scenario: any;
  currentRound: number = -1;
  author: string;
  name: string;
  numOfRounds: number;
  assetsDIR: any;

  constructor(props: any) {
    super(props);

    this.onBtnInputJSONClick = this.onBtnInputJSONClick.bind(this);
    this.onBtnInputDIRClick = this.onBtnInputDIRClick.bind(this);
    this.onBtnNextRoundClick = this.onBtnNextRoundClick.bind(this);
    this.onBtnPreviousRoundClick = this.onBtnPreviousRoundClick.bind(this);
  }

  componentDidMount(): void {
    document.getElementById("btnNextRound").setAttribute("disabled", "true");

    const input = document.getElementById("inputJSON");
    input.addEventListener("change", () => {
      const fr = new FileReader();
      fr.onload = (event) => {
        // @ts-ignore
        this.scenario = JSON.parse(fr.result);
        console.log(this.scenario);

        this.parseScenario();
      };
      // @ts-ignore
      fr.readAsText(input.files[0]);
    });

    
    this.forceUpdate();
  }

  componentDidUpdate() {
    if (this.currentRound === -1 || this.currentRound === 0)
      document.getElementById("btnPreviousRound").setAttribute("disabled", "true");
    else document.getElementById("btnPreviousRound").removeAttribute("disabled");
  }

  parseScenario(): void {
    this.name = this.scenario.name;
    this.author = this.scenario.author;
    this.numOfRounds = this.scenario.numOfRounds;

    if (!Codes.includes(this.scenario.code)) {
      document.getElementById(
        "pregame-header"
      ).textContent = `Выбран поврежденный или недопустимый файл.`;
      document.getElementById("btnNextRound").setAttribute("disabled", "true");
    } else {
      document.getElementById(
        "pregame-header"
      ).textContent = `Выбран "${this.name}". Автор: ${this.author}.`;
      document.getElementById("btnInputJSON").classList.add("completed");
      -document.getElementById("btnNextRound").removeAttribute("disabled");
    }
    this.forceUpdate();
  }

  onBtnInputJSONClick() {
    const inputJSON = document.getElementById("inputJSON");
    this.currentRound = -1;
    document.getElementById("pregame-header").classList.remove("no-display");
    this.forceUpdate();
    inputJSON.click();
    // now the code execution goes into componentDidMount()
  }

  async onBtnInputDIRClick() {
    // @ts-ignore
    this.assetsDIR = await window.showDirectoryPicker();
    document.getElementById(
      "pregame-header"
    ).textContent = `Выбран каталог: ${this.assetsDIR.name}`;
    document.getElementById("btnInputDIR").classList.add("completed");

    // const inputDIR = document.getElementById("inputDIR");
    // inputDIR.click();
  }

  onBtnPreviousRoundClick() {
    if (this.currentRound === -1 || this.currentRound === 0) return;
    this.currentRound--;
    this.forceUpdate();
  }

  onBtnNextRoundClick() {
    if (this.currentRound === -1)
      document.getElementById("pregame-header").classList.add("no-display");

    this.currentRound++;
    var btnsToHide: HTMLElement[] = [];
    btnsToHide.push(document.getElementById("btnPreviousRound"));
    btnsToHide.push(document.getElementById("btnInputDIR"));
    btnsToHide.push(document.getElementById("btnInputJSON"));
    btnsToHide.push(document.getElementById("btnNextRound"));
    btnsToHide.forEach(element => {
      element.classList.add("hidden-btn");
      document.getElementById("pop-down").appendChild(element);
    });
    document.getElementById("btnPreviousRound").classList.remove("no-display");
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <div className="centered hbox pop-down" id="pop-down"></div>
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
        </div>
        <h1 className="centered" id="pregame-header"></h1>
        <RoundWidget
          // @ts-ignore
          round={
            this.currentRound === -1
              ? null
              : this.scenario.rounds[this.currentRound]
          }
          assetsDIR={this.assetsDIR}
        />
      </div>
    );
  }
}

const root = createRoot(document.getElementById("root"));
root.render(<Main />);
