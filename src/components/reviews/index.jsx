// Please be my rave-boy, we can have some fun!~
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// import { Grid } from '@material-ui/core';
// // Components:
// import Overview from './overview';
import ReviewsList from './reviewsList';

class Reviews extends React.Component {
  constructor(props) {
    super(props);

    // Bind methods.
    this.getMetadata = this.getMetadata.bind(this);
    this.fetchAllReviews = this.fetchAllReviews.bind(this);
    this.sortReviews = this.sortReviews.bind(this);
    this.filterByRatings = this.filterByRatings.bind(this);
    this.changePageAndUpdate = this.updatePage.bind(this);
    this.changePageAndUpdate = this.changePage.bind(this);

    this.changeSortingMethod = this.changeSortingMethod.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    // Define state.
    this.state = {
      metadata: {},
      totalReviews: 0,
      expanded: false,
      currentSortMethod: 'relevant',
      page: 1,
      perPage: 2,
      ratingFilters: [],
      filteredReviews: [],
      reviews: [],
      allReviews: {
        relevant: [],
        helpful: [],
        newest: [],
      },
    };
  }

  componentDidMount() {
    this.getMetadata();
  }

  getMetadata() {
    const { id } = this.props;

    axios.get('http://18.224.37.110/reviews/meta', {
      params: {
        product_id: id,
      },
    })
      .then((res) => {
        const metadata = res.data;
        let totalReviews = 0;
        for (let i = 1; i <= 5; i += 1) {
          const amount = parseInt(metadata.ratings[i], 10);
          if (Number.isNaN(amount) === false) {
            totalReviews += metadata.ratings[i];
          }
        }

        this.setState({
          metadata,
          totalReviews,
        }, () => {
          this.fetchAllReviews();
        });
      });
  }

  fetchAllReviews(page = 1) {
    const { id } = this.props;
    const { reviews } = this.state;

    const params = {
      product_id: id,
      sort: 'relevant',
      count: 100,
      page,
    };

    axios.get('http://18.224.37.110/reviews/', { params })
      .then((res) => {
        const newReviews = [...reviews, ...res.data.results];
        this.setState({
          reviews: newReviews,
        }, () => {
          if (res.data.results.length >= 100) {
            this.fetchAllReviews(page + 1);
          } else {
            this.sortReviews();
          }
        });
      });
  }

  sortReviews() {
    const { reviews } = this.state;
    const newest = [...reviews].sort((a, b) => {
      let direction = 0;
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);

      if (aDate > bDate) {
        direction = -1;
      } else if (aDate < bDate) {
        direction = 1;
      }

      return direction;
    });
    const helpfulness = [...newest].sort((a, b) => {
      let direction = 0;
      const aHelpfulness = a.helpfulness;
      const bHelpfulness = b.helpfulness;

      if (aHelpfulness > bHelpfulness) {
        direction = -1;
      } else if (aHelpfulness < bHelpfulness) {
        direction = 1;
      }

      return direction;
    });

    this.setState({
      allReviews: {
        relevant: reviews,
        helpful: helpfulness,
        newest,
      },
    }, () => {
      this.filterByRatings();
    });
  }

  filterByRatings() {
    const {
      ratingFilters,
      currentSortMethod,
      allReviews,
      page,
    } = this.state;
    let allowed = [];

    if (ratingFilters.length === 0 || ratingFilters.length === 5) {
      allowed = [1, 2, 3, 4, 5];
    } else {
      allowed = ratingFilters;
    }

    const reviews = [...allReviews[currentSortMethod]]
      .filter((review) => {
        if (allowed.includes(review.rating)) {
          return true;
        }
        return false;
      });

    this.setState({ filteredReviews: reviews, reviews: [] }, () => {
      console.log('ran')
      this.updatePage(page);
    });
  }

  changePage(change = 1) {
    const { page } = this.state;
    let newPage = page + change;
    if (Number.isNaN(newPage)) {
      throw new Error(`Could not turn ${page} and ${change} into a new valid page number.`);
    } else if (newPage < 1) {
      newPage = 1;
    }

    this.setState({
      page: newPage,
    }, () => { this.updatePage(); });
  }

  updatePage() {
    const { page, perPage, filteredReviews } = this.state;
    this.setState({
      reviews: [...filteredReviews].splice(perPage * (page - 1), perPage),
    });
  }

  // ReviewsList Funcs
  changeSortingMethod(method) {
    if (['relevant', 'newest', 'helpful'].includes(method)) {
      this.setState({ currentSortMethod: method }, () => { this.filterByRatings(); });
    } else {
      alert('There was an error changing the sorting method.');
      throw new Error(`WARNING: method was ${method} which is not an acceptable method.`);
    }
  }

  toggleExpanded() {
    const { expanded } = this.state;
    this.setState({
      expanded: !expanded,
      perPage: !expanded ? 2 : 10,
    }, () => this.updatePage());
  }

  // updateById(id) {

  // }

  // markAsHelpful(id) {
  //   axios.put(`http://18.224.37.110/reviews/${id}/helpful`)
  //     .then(() => {
  //       this.getReviews();
  //     })
  //     .catch((e) => {
  //       alert(e);
  //     });
  // }

  render() {
    const {
      reviews,
      currentSortMethod,
      expanded,
    } = this.state;

    return (
      <div>
        <div className="Overview">
          RATINGS & REVIEWS
        </div>
        <div className="ReviewList">
          <ReviewsList
            reviews={reviews}
            sortType={currentSortMethod}
            changeSortType={this.changeSortingMethod}
            expanded={expanded}
            toggleExpanded={this.toggleExpanded}
          />
        </div>
      </div>
    );
  }
}

Reviews.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Reviews;
