// Please be my rave-boy, we can have some fun!~
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Grid } from '@material-ui/core';
// Components:
import Overview from './overview';
import ReviewsList from './reviewsList';

class Reviews extends React.Component {
  constructor(props) {
    super(props);

    // Bind methods.
    this.getReviews = this.getReviews.bind(this);
    this.getMetadata = this.getMetadata.bind(this);
    this.markAsHelpful = this.markAsHelpful.bind(this);
    this.reportReview = this.reportReview.bind(this);
    this.changeSortingMethod = this.changeSortingMethod.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);

    // Define state.
    this.state = {
      metadata: null,
      reviews: null,
      sortType: 'relevant',
      currentPage: 1,
      expanded: false,
      ratingsFilters: []
    };
  }

  componentDidMount() {
    this.getReviews();
    this.getMetadata();
  }

  getReviews() {
    const { id } = this.props;
    const { sortType, expanded } = this.state;
    const amount = expanded ? 10 : 2;

    axios.get('http://18.224.37.110/reviews/', {
      params: {
        product_id: id,
        sort: sortType,
        count: amount,
      },
    })
      .then((res) => {
        console.log(res);
        this.setState({
          reviews: res.data.results,
        });
      });
  }

  getMetadata() {
    const { id } = this.props;

    axios.get('http://18.224.37.110/reviews/meta', {
      params: {
        product_id: id,
      },
    })
      .then((res) => {
        console.log(res);
        this.setState({
          metadata: res.data,
        });
      });
  }

  markAsHelpful(id) {
    axios.put(`http://18.224.37.110/reviews/${id}/helpful`)
      .then(() => {
        this.getReviews();
      })
      .catch((e) => {
        alert(e);
      });
  }

  reportReview(id) {
    axios.put(`http://18.224.37.110/reviews/${id}/report`)
      .then(() => {
        this.getReviews();
      })
      .catch((e) => {
        alert(e);
      });
  }

  changeSortingMethod(method) {
    if (['relevant', 'newest', 'helpful'].includes(method)) {
      this.setState({ sortType: method });
      this.getReviews();
      return;
    }
    alert('There was an error changing the sorting method.');
    throw new Error(`WARNING: method was ${method} which is not an acceptable method.`)
  }

  toggleExpanded() {
    const { expanded } = this.state;
    this.setState({
      expanded: !expanded,
    });
  }

  render() {
    const { reviews, metadata, sortType } = this.state;

    return (
      <Grid container>
        <Grid item xs={3}>
          <Overview metadata={metadata} />
        </Grid>
        <Grid item xs={9}>
          <ReviewsList
            reviews={reviews}
            markAsHelpful={this.markAsHelpful}
            report={this.reportReview}
            sortType={sortType}
            changeSortType={this.changeSortingMethod}
            toggleExpanded={this.toggleExpanded}
          />
        </Grid>
      </Grid>
    );
  }
}

Reviews.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Reviews;
