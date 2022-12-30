import React from "react";
import QuestionObject from "./question";

enum State {
  Nothing,
  Round,
  Question,
  Answer,
}

export default class RoundWidget extends React.Component {
  text: string;
  _state: State = State.Nothing;
  _question: QuestionObject;
  _assets = new Map<string, any>();
  _clickedBtnsIDs = new Array<string>();

  constructor(
    props:
      | { round: any; assetsDIR: any }
      | Readonly<{ round: any; assetsDIR: any }>
  ) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.onBtnPreviousClick = this.onBtnPreviousClick.bind(this);
    this.onBtnNextClick = this.onBtnNextClick.bind(this);
  }

  componentDidMount(): void {
    window.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "ArrowRight")
          document.getElementById("btnNext").click();
        if (event.key === "ArrowLeft")
          document.getElementById("btnPrevious").click();
      },
      true
    );
  }

  async componentDidUpdate(
    prevProps: Readonly<{}>,
    prevState: Readonly<{}>,
    snapshot?: any
  ) {
    if (this.props == prevProps) return;

    // @ts-ignore
    if (this.props.round != null) {
      this._state = State.Round;
      // @ts-ignore
      this.text = this.props.round.roundName;
      document.getElementById("btnNext").classList.remove("no-display");
      document.getElementById("btnPrevious").classList.remove("no-display");
    } else {
      this._state = State.Nothing;
      document.getElementById("btnNext").classList.add("no-display");
      document.getElementById("btnPrevious").classList.add("no-display");
    }
    this.forceUpdate();

    // @ts-ignore
    if (this.props.assetsDIR != undefined && this.props.assetsDIR != null) {
      // @ts-ignore
      for await (const entry of this.props.assetsDIR.values()) {
        entry.getFile().then((val: any) => {
          this._assets.set(val.name, URL.createObjectURL(val));
        });
      }
    }
  }

  handleClick(topic: number, question: number) {
    // @ts-ignore
    const questionObj = this.props.round.topics[topic].questions[question];

    this._state = State.Question;
    this._question = new QuestionObject(
      questionObj.question,
      questionObj.answer,
      questionObj.value,
      questionObj.image === "none" ? null : questionObj.image
    );
    this.forceUpdate();
  }

  onBtnPreviousClick() {
    if (this._state === State.Answer) {
      this._state = State.Question;
    } else if (this._state === State.Question) {
      this._state = State.Round;
    }
    this.forceUpdate();
  }

  onBtnNextClick() {
    if (this._state === State.Question) {
      this._state = State.Answer;
    } else if (this._state === State.Answer) {
      this._state = State.Round;
    }
    this.forceUpdate();
  }

  Question = (props: any) => {
    const classes = this._clickedBtnsIDs.includes(
      props.topicIndex + props.questionIndex + props.roundIndex
    )
      ? "btn completed"
      : "btn";
    return (
      <button
        id={props.topicIndex + props.questionIndex + props.roundIndex}
        className={classes}
        type="button"
        onClick={() => {
          props.onClick();
          this._clickedBtnsIDs.push(
            props.topicIndex + props.questionIndex + props.roundIndex
          );
        }}
      >
        {props.content}
      </button>
    );
  };

  Topic = (props: any) => {
    const content = props.questions.map((value: any, index: number) => {
      return (
        <this.Question
          key={index}
          questionIndex={index}
          topicIndex={props.topicName}
          roundIndex={props.roundName}
          content={value.value}
          onClick={() => {
            props.onClick(index);
          }}
        />
      );
    });

    return (
      <div className="topic hbox">
        <h2>{props.topicName}</h2>
        {content}
      </div>
    );
  };

  render() {
    var rootClasses = "";
    var content = null;

    switch (this._state) {
      case State.Nothing:
        rootClasses += "hidden";
        break;

      case State.Round:
        // @ts-ignore
        const topics = this.props.round.topics;

        content = topics.map((value: any, index: number) => {
          return (
            <this.Topic
              key={index}
              topicName={value.topicName}
              // @ts-ignore
              roundName={this.props.round.roundName}
              questions={value.questions}
              onClick={(question: number) => {
                this.handleClick(index, question);
              }}
            />
          );
        });
        break;

      case State.Question:
        content = (
          <div>
            <h1>{this._question.text}</h1>
            {this._question.imagePath === null ? (
              ""
            ) : (
              <img src={this._assets.get(this._question.imagePath)} />
            )}
          </div>
        );
        break;

      case State.Answer:
        content = (
          <div>
            <h1>{this._question.answer}</h1>
          </div>
        );
    }

    return (
      <div id="round-widget-root" className={rootClasses}>
        <div className="hbox centered big-gap">
          <button
            id="btnPrevious"
            className="btn no-display"
            type="button"
            onClick={this.onBtnPreviousClick}
          >
            ⮜
          </button>

          <button
            id="btnNext"
            className="btn no-display"
            type="button"
            onClick={this.onBtnNextClick}
          >
            ⮞
          </button>
        </div>
        <h1>{this.text}</h1>
        {content}
      </div>
    );
  }
}
