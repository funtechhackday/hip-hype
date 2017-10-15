import React, {Component} from 'react'
// import cn from 'classnames'
import Recorder, {isFlash} from './audio-recorder'

const BLOCK_CLASS = 'ce-text-fragment'

class AudioRecord extends Component {

	constructor(props) {
		super(props)

		const isNeedFlash = isFlash()
		const maxTime = 50
		const userId = props.user_id
		const el = document.body
		const question = this.props.question


		this.state = {
			unavailable: !isNeedFlash,
			minTime: 0,
			maxTime,
			isFlash: isNeedFlash,
			question: {
				...{
					recorder: props.question && props.question.recorder ||
					new Recorder(el, `${userId}-${props.id}-${question.id}`, {
						enable: this.enableButton.bind(this),
						disable: this.disableButton.bind(this),
						loader: this.toggleLoader.bind(this),
						handleRecord: this.onRecordReady.bind(this),
						onprocess: this.processHandler.bind(this),
						reset: this.resetRecord.bind(this),
						status: this.updateStatus.bind(this),
					}, this),
					playButton: true,
					loader: false,
					firstTime: isNeedFlash ? maxTime : 5,
					currentTime: 0,
					status: props.question.recorder && props.question.recorder.status || 'ready',
					// answerRecord,
				},
				...props.question,
			},
			// question: this.loadQuestion(props),
		}
	}

	componentDidMount() {
		if (this.state.isFlash) {
			this.state.question.recorder.init()
			this.state.question.loader = true
		}
	}

	componentWillReceiveProps(props) {
		// this.setState({
			// question: this.loadQuestion(props),
		// })
	}

	// loadQuestion(props) {
	// 	const isNeedFlash = isFlash()
	// 	const maxTime = 600
	// 	const el = document.body
	// 	const userId = props.user
	//
	// 	// const answerRecord = (props.question.user_answer && props.question.user_answer.record_url)
	// 	// || (props.question.answer && props.question.answer.record_url) || null
	// 	const answerRecord = null
	//
	// 	let question = props.question
	// 	question = {
	// 		...{
	// 			recorder: props.question.recorder ||
	// 			new Recorder(el, `${userId}-${props.id}-${question.id}`, {
	// 				enable: this.enableButton.bind(this),
	// 				disable: this.disableButton.bind(this),
	// 				loader: this.toggleLoader.bind(this),
	// 				handleRecord: this.onRecordReady.bind(this),
	// 				onprocess: this.processHandler.bind(this),
	// 				reset: this.resetRecord.bind(this),
	// 				status: this.updateStatus.bind(this),
	// 			}, this),
	// 			playButton: true,
	// 			loader: false,
	// 			firstTime: isNeedFlash ? maxTime : 120,
	// 			currentTime: 0,
	// 			status: props.question.recorder && props.question.recorder.status || 'ready',
	// 			answerRecord,
	// 		},
	// 		...props.question,
	// 	}
	// 	if (answerRecord && !props.question.answerRecord) {
	// 		const player = question.recorder.setRecord(answerRecord)
	// 		player.onloadedmetadata = () => {
	// 			this.updateQuestion({...question, firstTime: player.duration})
	// 		}
	// 		player.load()
	// 	}
	// 	return question
	// }

	updateQuestion(question) {
		// if (this.props.handlers && this.props.handlers.updateQuestion) {
		// 	this.props.handlers.updateQuestion(question)
		// }
		// else {
		this.setState({
			question,
		})
		// }
	}

	renderTime = (seconds) => {
		const m = Math.floor(seconds / 60)
		let s = Math.floor(seconds - (m * 60))

		// m = m < 10 ? `0${m}` : m
		if (isNaN(s) || isNaN(m)) {
			return '0:00'
		}
		s = s < 10 ? `0${s}` : s
		return <time>{m}:{s}</time>
	}

	togglePlay = () => {
		window.console.log('toggle play')
		const question = this.state.question
		question.recorder.togglePlay()
	};

	pause = () => {
		window.console.log('pause')
		const question = this.state.question
		question.recorder.pause()
	};

	stopPlaying = () => {
		window.console.log('stop playing')
		const question = this.state.question
		question.recorder.stopPlaying()
	};

	remove = () => {
		window.console.log('remove')
		const question = this.state.question
		question.recorder.remove()
	};

	updateCurrentTime = (event) => {
		const question = this.state.question
		const target = event.currentTarget

		if (question.answerRecord) {
			const rect = target.getBoundingClientRect()
			const x = event.pageX - rect.left
			const w = rect.width
			const percent = x / w * 100

			question.recorder.updateTime(percent)
			this.props.handlers.updateTime(question)
		}
	};

	enableButton = () => {
		const question = this.state.question
		question.playButton = false

		this.updateQuestion(question)
	};

	disableButton = () => {
		const question = this.state.question
		question.playButton = false

		this.updateQuestion(question)
	};

	toggleLoader = (id, loader) => {
		const question = this.state.question
		question.loader = loader

		this.updateQuestion(question)
	};

	onRecordReady = (encodedRecord, status) => {
		const question = this.state.question
		question.currentTime = 0
		question.answerRecord = encodedRecord
		question.firstTime = status.duration
		question.isUploaded = false

		this.toggleLoader(false)
		this.updateQuestion(question)
		this.props.handlers.changed()
	};

	processHandler = (context, r) => {
		const question = this.state.question

		question.currentTime = context.currentTime

		if (question.status === 'recording') {
			if (context.currentTime / question.firstTime >= 0.98 &&
				question.firstTime < this.state.maxTime &&
				context.currentTime < this.state.maxTime
			) {
				this.toggleRecord()
				// question.firstTime = question.firstTime / 80 * 100 <= this.state.maxTime ? question.firstTime / 80 * 100 : this.state.maxTime
			}
			else if (context.currentTime >= this.state.maxTime) {
				this.toggleRecord()
			}
		}
		if (question.status === 'playing') {
			if (context.currentTime >= context.duration) {
				question.recorder.stop()
			}
		}

		this.updateQuestion(question)
	};

	resetRecord = () => {
		const question = this.state.question

		question.currentTime = 0
		question.answerRecord = null
		question.firstTime = 5

		this.updateQuestion(question)
	};

	updateStatus = (status) => {
		const question = this.state.question
		question.status = status

		this.updateQuestion(question)
	};

	toggleRecord = () => {
		const question = this.state.question

		if (question.status !== 'recording') {
			question.firstTime = 5
			question.currentTime = 0
			question.answerRecord = null
		}

		question.recorder.toggleRecord()
	};

	getButtonsData() {
		let handler = false
		let buttonClass = 'record'
		let blockClass = 'ready'
		let blockTitle = 'Записать ответ'
		let secondButton = null

		const question = this.state.question

		if (question.answerRecord &&
				question.status !== 'playing' &&
				question.status !== 'paused' &&
				question.status !== 'recording'
			) {
			handler = this.togglePlay.bind(this)
			buttonClass = 'play'
			blockClass = 'play'
			blockTitle = 'Ваш ответ записан'
			secondButton = <button
				onClick={this.toggleRecord.bind(this)}
				className='recorder_secondary-button fa fa-repeat' />
		}
		else if (question.answerRecord &&
				question.status === 'paused' &&
				question.status !== 'recording'
			) {
			handler = this.togglePlay.bind(this)
			buttonClass = 'play'
			blockClass = 'play'
			blockTitle = 'Ваш ответ записан'
			secondButton = <button
				onClick={this.stopPlaying.bind(this)}
				className='recorder_secondary-button fa fa-repeat' />
		}
		else if (question.answerRecord &&
				!this.state.isFlash &&
				question.status === 'playing' &&
				question.status !== 'recording'
			) {
			handler = this.pause.bind(this)
			buttonClass = 'pause'
			blockClass = 'play'
			blockTitle = 'Воспроизведение'
			secondButton = <button
				onClick={this.stopPlaying.bind(this)}
				className='recorder_secondary-button fa fa-repeat' />
		}
		else if (question.answerRecord &&
				this.state.isFlash &&
				question.status === 'playing' &&
				question.status !== 'recording'
			) {
			handler = this.stopPlaying.bind(this)
			buttonClass = 'stop'
			blockClass = 'play'
			blockTitle = 'Воспроизведение'
			secondButton = null
		}
		else if (question.recorder &&
				question.status !== 'recording'
			) {
			handler = this.toggleRecord.bind(this)
			buttonClass = 'microphone'
		}
		else if (question.status === 'recording') {
			handler = this.toggleRecord.bind(this)
			buttonClass = 'stop'
			blockClass = 'record'
			blockTitle = 'Идет запись'
		}

		if (question.loader && question.status === 'init') {
			buttonClass = 'loading'
			secondButton = null
			blockTitle = 'Загрузка...'
		}
		else if (question.loader) {
			buttonClass = 'loading'
			secondButton = null
			blockTitle = 'Вы можете приступить к следующему вопросу'
		}

		return {
			handler,
			buttonClass,
			blockClass,
			blockTitle,
			secondButton,
		}
	}

	render() {
		const question = this.state.question

		const {
			handler,
			buttonClass,
			blockClass,
			blockTitle,
			secondButton,
		} = this.getButtonsData()

		return <div className={`recorder -${blockClass}`}>
			{!question.loader && <button
				onClick={handler}
				className={`fa fa-${buttonClass} recorder_main-button `}></button>}

			{question.loader && <svg
				className='ex-spinner ex-speaking-plain_spinner'
				viewBox='0 0 100 100'>
				<circle
					className='ex-spinner_inner'
					cx='50'
					cy='50'
					r='40' >
				</circle>
			</svg>}

			<div className={`recorder_time-container ${this.state.isFlash ? '-ie' : ''}`}>
				{!question.loader && !this.state.isFlash && <span className='recorder_time'>
					{this.renderTime(question.currentTime)} / {this.renderTime(question.firstTime)}
					{this.props.allowRecord && secondButton}
				</span>}
			</div>
			<div className='ex-speaking-plain_record'>
				<div className='ex-speaking-plain_content'>

					{
						question.loader &&
						question.status === 'export' &&
							<div className='ex-speaking-plain_progress-placeholder'>
								Вы можете приступить к следующему вопросу
							</div>
					}

					{!question.loader && !this.state.isFlash && <div
						onClick={this.updateCurrentTime.bind(this)}
						className='ex-speaking-plain_record-progress'>
						{!!this.state.minTime && <div
							style={{
								left: `${this.state.minTime / question.firstTime * 100}%`,
							}}
							className='ex-speaking-plain_record-progress-min' />}

						<div
							style={{
								width: `${question.currentTime / question.firstTime * 100}%`,
							}}
							className='ex-speaking-plain_record-progress-track' />
					</div>}
				</div>


			</div>
		</div>
	}
}
// TODO: add prop types

AudioRecord.defaultProps = {
	onMouseDown: () => {},
	onMouseUp: () => {},
	onMount: () => {},
	handlers: {
		changed: () => {},
		updateTime: (question) => {
		},
	},
	allowRecord: true,
}

export default AudioRecord
