import React from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
} from '@material-ui/core';
import {
  FullscreenExit,
} from '@material-ui/icons';

class ShowFullscreenImage extends React.Component {
  constructor(props) {
    super(props);

    this.openModel = this.openModel.bind(this);
    this.closeModel = this.closeModel.bind(this);

    this.recent = null;
    this.state = {
      currentImage: null,
    };
  }

  componentDidUpdate() {
    this.openModel();
  }

  openModel() {
    const { currentImage } = this.state;
    const { image } = this.props;

    if (currentImage !== image && this.recent !== image) {
      this.setState({
        currentImage: image,
      }, () => {
        document.body.style.overflow = 'hidden';
      });
    }
  }

  closeModel() {
    const { currentImage } = this.state;

    this.recent = currentImage;
    this.setState({
      currentImage: null,
    }, () => {
      this.recent = null;
      document.body.style.overflow = 'scroll';
    });
  }

  render() {
    const { currentImage } = this.state;
    if (currentImage === null) { return ''; }
    return (
      <div
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          backgroundImage: `url(${currentImage})`,
          backgroundImageSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden',
          zIndex: '1000',
          position: 'absolute',
          top: document.documentElement.scrollTop,
          left: 0,
          width: '100%',
          height: '100%',
          // display: `${currentImage === null ? 'inline' : 'none'}`,
        }}
      >
        <IconButton
          onClick={this.closeModel}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: '#FFFFFF',
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}
        >
          <FullscreenExit />
        </IconButton>
      </div>
    );
  }
}

ShowFullscreenImage.propTypes = {
  image: PropTypes.string.isRequired,
};

export default ShowFullscreenImage;
