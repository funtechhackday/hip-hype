import PropTypes from 'prop-types';
import React from 'react';
import AudioRecord from './audio-record.jsx';

export default class Track extends React.Component {
  static propTypes = {
    // name: PropTypes.string.isRequired, // this is passed from the Rails view
  };

  /**
   * @param props - Comes from your rails view.
   */
  constructor(props) {
    super(props);

    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    this.state = { name: this.props.name };
  }

  updateName = (name) => {
    this.setState({ name });
  };

  sendData() {
    const token = document.querySelector('meta[name="csrf-token"]').content
    formData = new FormData(this.form)
	  formData.append('record', question.answerRecord)

		contentType = 'application/x-www-form-urlencoded'
		processData = true
	

		$.ajax(`/hype_tracks/${this.props.track_id}/add_record`,
			{
				method: 'POST',
				data: formData,
				processData,
				contentType,
				beforeSend: (xhr) => {
					xhr.setRequestHeader('X-CSRF-Token', token)
				},
			}
		)
		.done(res => {
			this.toggleLoader(question.id, false)
			if (res.closest_correct_answer) {
				this.selectAnswer(res.closest_correct_answer)

				this.addToDialog({
					is_user: true,
					id: `answer-${id}`,
					audio: res.record_url,
					text: res.record_text,
				})

				this.successRecognize()
			}
			else {
				this.failRecognize()
			}
		})
		.fail(res => {
			this.toggleLoader(question.id, false)
			this.failRecognize()
		})

  }

  updateQuestion(question) {
    this.setState({question})
  }

  render() {
    return (
      <div className='track-detail card'>
        <form
          ref={(form) => { this.form = form; }} >
        {this.props.strings.map((el,key) => {
          return <div key={key}>{el}</div>
        })}
        <AudioRecord
            user={this.props.user_id}
            handlers={{
              updateQuestion: this.updateQuestion.bind(this)
            }}
            question={{
              id: this.props.track_id}}  />
            <div className='form-group'>
              <label>Напишите строчку для следующего участника</label>

              <input className='form-control' name='string'></input>
            </div>
            <div className='form-group'>
              <button onckick={this.sendData} type='submit' className='btn btn-primary'>Отправить</button>
            </div>
        </form>
      </div>
    );
  }
}
