export default class QuestionObject {
  text: string;
  answer: string;
  value: number;
  imagePath: string;

  constructor(text: string, answer: string, value: number, imagePath: string) {
    this.text = text;
    this.answer = answer;
    this.value = value;
    this.imagePath = imagePath;
  }
}
