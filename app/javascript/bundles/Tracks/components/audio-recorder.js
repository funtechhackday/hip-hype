/* global Wami, RecorderJS */
/* eslint-disable no-console */

// import RecorderJS from './RecorderJS/recordmp3.js'

export function isFlash() {
	// return true
	const ua = window.navigator.userAgent
	navigator.getUserMedia = (navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia)

	const msie = ua.indexOf('MSIE ')
	if (msie >= 0) {
		// IE 10 or older => return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)))
	}

	const trident = ua.indexOf('Trident/')
	if (trident >= 0) {
		// IE 11 => return version number
		const rv = ua.indexOf('rv:')
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)))
	}

	const edge = ua.indexOf('Edge/')
	if (edge >= 0) {
		// Edge (IE 12+) => return version number
		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)))
	}

	const chrome = ua.indexOf('Chrome/')
	const safari = ua.indexOf('Safari/')
	if (!navigator.getUserMedia && safari >= 0 && chrome < 0) {
		return parseInt(ua.substring(safari + 7, ua.indexOf('.', safari)))
	}

	// other browser
	return false
}

class IERecorder {
	constructor(element, id, actions) {
		this.id = id
		this.elementId = `js-recorder-${id}`
		this.element = element
		this.actions = actions
		this.audioContext = null
		this.instance = null
		this.player = null
		this.status = 'empty'
		this.hasRecord = false
		this.process = null
		this.processCallback = actions.onprocess ?
			actions.onprocess :
			() => {}
	}

	init() {
		this.setStatus('init')
		const el = document.createElement('div')

		el.id = `js-recorder-${this.id}`
		this.element.appendChild(el)

		Wami.setup({
			id: this.elementId,
			swfUrl: '/static/assets/wami-rec/Wami.swf',
			onReady: () => {
				this.setStatus('ready')
				this.actions.loader(false)
			},
			onError: () => {
				console.log('ERRROROROR')
			},
		})

		setTimeout(() => {
			const fl = document.getElementById(this.elementId)
			const obj = fl.querySelector('object')
			if (!obj) {
				this.setStatus('unavailable')
			}
		}, 5000)
	}

	record() {
		console.log('Recording... (id: ', this.id, ')')
		Wami.startRecording(`/learn/element_items/${this.id}/records/upload`)
		this.setStatus('recording')
		// this.process = setInterval(this.processCallback.bind(null, Wami), 500)
	}

	play() {
		const recordPath = this.recordUrl ? this.recordUrl : `/learn/element_items/${this.id}/records/download`
		const that = this

		function stopPlaying() {
			that.stopPlaying()
		}

		Wami.startPlaying(recordPath, null, Wami.nameCallback(stopPlaying), null)
		this.setStatus('playing')
	}

	stop() {
		console.log('Stopped...')
		// this.process && clearInterval(this.process)
		Wami.stopRecording()
		Wami.stopPlaying()
		if (this.status === 'recording') {
			this.hasRecord = true
			this.actions.enable()
			this.actions.handleRecord(this.id, {duration: 0})
		}
		this.setStatus('stopped')
	}

	pause() {
		console.log('Stopped...')
		// this.process && clearInterval(this.process)
		Wami.stopPlaying()
		this.setStatus('stopped')
	}

	stopPlaying() {
		console.log('Stopped...')
		// this.process && clearInterval(this.process)
		Wami.stopPlaying()
		this.setStatus('stopped')
	}

	remove() {
		this.actions.disable()
		this.actions.reset()
		this.stop()
		this.hasRecord = false
		this.setStatus('empty')
	}

	setStatus(status) {
		this.status = status
		this.actions.status(status)
	}

	setRecord(recordUrl) {
		this.recordUrl = recordUrl
	}
}

class notIERecorder {
	constructor(element, id, actions) {
		this.id = id
		this.element = element
		this.actions = actions
		this.audioContext = null
		this.instance = null
		this.player = null
		this.status = 'empty'
		this.process = null
		this.processCallback = actions.onprocess ?
			actions.onprocess :
			() => {}
	}

	init() {
		try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext
			window.URL = window.URL || window.webkitURL

			if (!navigator.getUserMedia) {
				this.audioContext = null
			}
			else {
				this.audioContext = new AudioContext
			}

			console.info('usRecord: Audio context set up.')
			console.info(`usRecord: navigator.getUserMedia ${navigator.getUserMedia ? 'available.' : 'not present!'}`)
		}
		catch (e) {
			console.error('usRecord: No web audio support in this browser!')
		}

		navigator.getUserMedia && navigator.getUserMedia({audio: true}, (stream) => {
			const input = this.audioContext.createMediaStreamSource(stream)

			console.info('usRecord: Media stream created.')
			console.info(`usRecord: input sample rate ${input.context.sampleRate}`)

			this.instance = new RecorderJS(input)

			this.instance.configure({
				onSuccess: (encoded, buffer, blob) => {
					console.log({
						encoded,
						buffer,
						blob,
					})
					const blobURL = window.URL.createObjectURL(encoded)
					this.player = new Audio(blobURL)
					this.player.ontimeupdate = this.processCallback.bind(null, this.player, this)
					this.player.onended = this.stopPlaying

					setTimeout(() => {
						this.actions.enable()
						// this.actions.loader(false)
						this.actions.handleRecord(encoded, this.player)
						this.audioContext.close()
						this.setStatus('ready')
					}, 100)

					console.info('usRecord: Export WAV')
				},
			})

			this.setStatus('ready')

			console.info('usRecord: Recorder initialised.')

			this.record()
		},
		(e) => {
			console.warn(`usRecord: No live audio input: ${e}`)
		})
	}

	record() {
		if (!this.instance && !this.status) {
			this.init()
		}

		if (this.instance && this.audioContext.state !== 'closed') {
			this.setStatus('recording')

			this.instance.record()

			this.process = setInterval(this.processCallback.bind(null, this.audioContext, this), 500)

			console.info('Recording...')
		}
		else {
			this.init()
		}
	}

	play() {
		if (this.player) {
			this.player.play()
			this.setStatus('playing')
		}
	}

	setRecord(record) {
		this.player = new Audio(record)
		this.player.ontimeupdate = this.processCallback.bind(null, this.player, this)
		this.player.onended = this.stopPlaying

		setTimeout(() => {
			this.actions.enable()
			this.actions.loader(false)
			this.actions.handleRecord(record, this.player)
			// this.audioContext.close()
			this.setStatus('ready')
		}, 100)
		return this.player
	}

	pause() {
		if (this.player) {
			this.player.pause()
			this.setStatus('paused')
		}
	}

	stopPlaying() {
		if (this.player) {
			this.player.pause()
			this.player.currentTime = 0
			this.setStatus('stopped')
			this.processCallback(this.player, this)
		}
	}

	updateTime(percent) {
		this.player.currentTime = this.player.duration / 100 * percent
		this.processCallback(this.player, this)
	}

	stop() {
		this.process && clearInterval(this.process)

		if (this.instance && this.status !== 'playing' && this.status !== 'empty') {
			this.setStatus('export')
			console.info('usRecord: Export WAV to MP3 started')
			this.instance.stop()
			this.actions.loader(true)
			this.instance.exportWAV()
			this.instance.clear()
		}
		else if (this.status === 'playing' || !this.status) {
			this.setStatus('stopped')
			this.stopPlaying()
		}
		else if (!this.instance) {
			console.error('usRecord: Instance of RecordJS not found!')
		}
	}

	remove() {
		this.setStatus('empty')
		this.actions.disable()
		this.actions.reset()
		this.stop()
	}

	setStatus(status) {
		this.status = status
		this.actions.status(status)
	}
}

const RecorderClass = isFlash() ? IERecorder : notIERecorder

class Recorder extends RecorderClass {
	toggleRecord() {
		if (this.status === 'recording') {
			this.stop()
		}
		else {
			this.record()
		}
	}

	togglePlay() {
		// console.log(this.status)
		if (this.status === 'paused' || this.status === 'stopped' || this.status === 'ready') {
			this.play()
		}
		else if (this.status === 'playing') {
			this.stop()
		}
	}
}

export default Recorder
