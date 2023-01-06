import { Component, OnInit } from '@angular/core';
import quizz_questions from '../../../assets/data/quizz_questions.json'

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {

  title: string = ""

  questions: any
  questionSelected: any

  answers: string[] = []
  answerSelected: string = ""

  // usar ponteiro como contador pra saber qual é a questão atual
  questionIndex: number = 0
  questionMaxIndex: number = 0

  finished: boolean = false

  constructor() { }

  ngOnInit(): void {
    if(quizz_questions){
      this.finished = false
      this.title = quizz_questions.title

      this.questions = quizz_questions.questions
      this.questionSelected = this.questions[this.questionIndex]

      this.questionIndex = 0
      this.questionMaxIndex = this.questions.length
    }
  }

  playerChoose(value: string) {
    this.answers.push(value)
    this.nextStep()
  }

  async nextStep() {
    this.questionIndex += 1

    if (this.questionMaxIndex > this.questionIndex) {
      this.questionSelected = this.questions[this.questionIndex]
    } else {

      // chamando a função pra calcular se foi A ou B e armazenar
      const finalAnswer: string = await this.checkResult(this.answers)
      this.finished = true

      // estamos dizendo que ele vai ser de um mesmo tipo do tipo que ele espera (pois passamos algo que ele n sabe)
      this.answerSelected = quizz_questions.results[finalAnswer as keyof typeof quizz_questions.results]
    }

  }

  // essa função verifica se tem mais A ou B
  // Lógica: compara o atual com o anterior -> se ele tem mais ou menos (maior ou menor...) --> se for igual acontece nada
  // algoritmo de maio frequencia...
  async checkResult(answers: string[]) {
    const result = answers.reduce((previous, current, i, arr) => {
      if (
        arr.filter(item => item === previous).length >
        arr.filter(item => item === current).length
      ) {
        return previous
      } else {
        return current
      }
    })

    return result
  }

}
