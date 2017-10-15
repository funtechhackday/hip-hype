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

  render() {
    return (
      <div className='track-detail card'>
        <AudioRecord
            user={this.props.user_id}
            question={{
              id: this.props.track_id}}  />


      </div>
    );
  }
}
