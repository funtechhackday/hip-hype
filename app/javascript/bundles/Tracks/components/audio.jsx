/* global audioController isFlash */
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Recorder, {isFlash} from './audio-recorder'
import AudioRecord from './audio-record.jsx'
// import Question from '../question.jsx'
import * as lib from '../../modules-map.js'
import {updateMark, updateExercise} from '../../check-exercise'

// const recController = audioController()

class Audio extends Component {
	constructor(props) {
		super(props)

		const isNeedFlash = isFlash()
		const maxTime = 600

		const userId = gon && gon.user && gon.user.id ? gon.user.id : 0
		navigator.getUserMedia = (navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia)
		this.state = {
			unavailable: !navigator.getUserMedia && !isNeedFlash,
			minTime: 0,
			maxTime,
			isFlash: isNeedFlash,
			questions: props.questions,
		}

		this.props.verify.handler = this.verifyHandler.bind(this)
	}

	componentDidMount() {
		// if (this.state.isFlash) {
		// 	this.state.questions.forEach(question => {
		// 		question.recorder.init()
		// 		question.loader = true
		// 	})
		// }
	}

	onRecordReady = (id, encodedRecord, status) => {
		const questions = _.map(this.state.questions, q => {
			if (q.id === id) {
				q.currentTime = 0
				q.answerRecord = encodedRecord
				q.firstTime = status.duration
				q.isUploaded = false

				this.toggleLoader(q.id, false)
			}

			return q
		})

		this.setState({questions})

		this.statusHandler()
	};

	statusHandler(array) {
		const status = array || ['ready']

		this.props.verify.status(status)
	}

	updateCurrentTime = (id, event) => {
		const question = _.find(this.state.questions, q => q.id === id)
		const target = event.currentTarget

		if (question.answerRecord) {
			const rect = target.getBoundingClientRect()
			const x = event.pageX - rect.left
			const w = rect.width
			const percent = x / w * 100

			question.recorder.updateTime(percent)
		}
	};

	updateStatus = (id, status) => {
		const questions = _.map(this.state.questions, q => {
			if (q.id === id) {
				q.status = status
			}

			return q
		})

		this.setState({questions})
	};

	toggleRecord = (id) => {
		const question = _.find(this.state.questions, q => q.id === id)

		if (question.status !== 'recording') {
			question.firstTime = 120
			question.currentTime = 0
			question.answerRecord = null
		}

		question.recorder.toggleRecord()
	};

	updateQuestion(question) {
		const questions = _.map(this.state.questions, q => { return q.id === question.id ? question : q })
		this.setState({questions})
	}

	verifyHandler(callback, failedCallback) {
		const state = this.state
		const token = document.querySelector('meta[name="csrf-token"]').content

		let questions
		let contentType
		let processData

		if (this.state.isFlash) {
			const questionsData = this.state.questions.map(q => ({
				id: q.id,
				record: q.answerRecord,
				type: q.isUploaded ? 'existent' : 'ref',
			}))

			questions = {
				answers_data: JSON.stringify({questions: questionsData}),
			}

			contentType = 'application/x-www-form-urlencoded'
			processData = true
		}
		else {
			questions = new FormData()

			this.state.questions.forEach(q => {
				questions.append('answers_data[questions][][id]', q.id)

				if (q.answerRecord) {
					questions.append('answers_data[questions][][record]', q.answerRecord)
					questions.append('answers_data[questions][][type]', q.isUploaded ? 'existent' : 'binary')
				}
			})

			contentType = false // false -- важно! иначе рельсы не разбирают параметры
			processData = false
		}

		$.ajax(`/exercises/${this.props.id}/check`,
			{
				method: 'POST',
				data: questions,
				processData,
				contentType,
				xhr: () => {
					const xhr = new window.XMLHttpRequest()
					xhr.upload.addEventListener('progress', (evt) => {
						if (evt.lengthComputable) {
							const percentComplete = evt.loaded / evt.total
							this.props.setProcess(percentComplete)
							window.console.log(percentComplete)
						}
					}, false)
					xhr.upload.addEventListener('progress', (evt) => {
						if (evt.lengthComputable) {
							const percentComplete = evt.loaded / evt.total
							this.props.setProcess(percentComplete)
							window.console.log(percentComplete)
						}
					}, false)
					return xhr
				},
				beforeSend: (xhr) => {
					xhr.setRequestHeader('X-CSRF-Token', token)
				},
			}
		)
		.done((res) => {
			this.updateQuestions(res.questions)
			updateExercise.call(this, res)
			updateMark.call(this, res)

			if (res.correct) {
				callback(res)
			}
		})

		// lib.checkExercise.call(this, this.props.id, questions, () => {}, callback, failedCallback)
	}

	updateQuestions(resQuestions) {
		this.setState({questions: resQuestions})
	}

	resetRecord = (id) => {
		const questions = _.map(this.state.questions, q => {
			if (q.id === id) {
				q.currentTime = 0
				q.answerRecord = null
				q.firstTime = 120
			}

			return q
		})

		this.setState({questions})
	};

	processHandler = (id, context, r) => {
		const questions = _.map(this.state.questions, q => {
			if (q.id === id) {
				q.currentTime = context.currentTime

				if (q.status === 'recording') {
					if (context.currentTime / q.firstTime >= 0.98 &&
						q.firstTime < this.state.maxTime &&
						context.currentTime < this.state.maxTime
					) {
						q.firstTime = q.firstTime / 80 * 100 <= this.state.maxTime ? q.firstTime / 80 * 100 : this.state.maxTime
					}
					else if (context.currentTime >= this.state.maxTime) {
						this.toggleRecord(id)
					}
				}
				if (q.status === 'playing') {
					if (context.currentTime >= context.duration) {
						q.recorder.stop()
					}
				}
			}

			return q
		})

		this.setState({questions})
	};

	toggleLoader = (id, loader) => {
		const questions = _.map(this.state.questions, q => {
			if (q.id === id) {
				q.loader = loader
			}

			return q
		})

		this.setState({questions})
	};

	enableButton = (id) => {
		const questions = _.map(this.state.questions, q => {
			if (q.id === id) {
				q.playButton = true
			}

			return q
		})

		this.setState({questions})
	};

	disableButton = (id) => {
		const questions = _.map(this.state.questions, q => {
			if (q.id === id) {
				q.playButton = false
			}

			return q
		})

		this.setState({questions})
	};

	renderQuestion = (question, i) => {
        const isEnumerated = !this.props.properties.display_questions_as_plain_text

        return <Question
            key={i}
            count={i + 1}
            data-id={question.id}
            isEnumerated={isEnumerated}
            classes='ex-speaking-plain_question js-question'>
            <div className='ex-speaking-plain_title' dangerouslySetInnerHTML={{__html: question.question_string}}/>
            <AudioRecord
                user={gon && gon.user && gon.user.id ? gon.user.id : 0}
                question={question}
                handlers={{
                    changed: this.statusHandler.bind(this),
                    updateQuestion: this.updateQuestion.bind(this),
                    updateTime: () => {
                    },
                }}/>
        </Question>;
    }

	render() {
		const statuses = this.state.questions.map(q => q.status)
		if (this.state.unavailable || statuses.indexOf('unavailable') >= 0) {
			return <div className='ex-speaking-plain'>
				<span className='ex-speaking-plain_error'>Ваш браузер не поддерживает запись звука</span>
			</div>
		}
		else {
			const {state} = this.props
			const resultId = this.props.checking_result_id
			return <div className='ex-speaking-plain'>
				{['available', 'ready'].includes(state) && this.state.questions.map(this.renderQuestion)}
				{state === 'passed' && <div className='ex-essay_info'>
					<p className='ex-essay_info-text'>Ваше творческое упражнение отправлено на проверку.</p>
					<a
						href={'/exercise_checking_results_view/'}
						className='btn btn-transparent btn-blue ex-essay_btn'>
						Подробнее
					</a>
				</div>}
				{state === 'has_errors' && <div className='ex-essay_info'>
					<p className='ex-essay_info-text is-error'>
						Ваше творческое упражнение выполнено с ошибками.
					</p>
					<a
						href={`/exercise_checking_results_view/${resultId}`}
						className='btn btn-transparent btn-blue ex-essay_btn'>
						Исправить
					</a>
				</div>}
				{state === 'verified' && <div className='ex-essay_info'>
					<p className='ex-essay_info-text is-success'>
						Ваше творческое упражнение выполнено без ошибок!
					</p>
					<a
						href={`/exercise_checking_results_view/${resultId}`}
						className='btn btn-transparent btn-blue ex-essay_btn'>
						Посмотреть
					</a>
				</div>}

			</div>
		}
	}
}

export default Audio
