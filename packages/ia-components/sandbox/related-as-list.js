import IAReactComponent from './IAReactComponent.js';
import PropTypes from 'prop-types'
import TileImage from './tile-image.js';

import { RelatedService } from 'ia-js-client'

// TODO separate the data fetching from the presentation

export default class extends IAReactComponent {

  static propTypes = {
    identifier: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {
      related: []
    }

    const relatedService = new RelatedService();

    relatedService.get({identifier: this.props.identifier})
        .then((related) => {
          this.setState({related: related.data.hits.hits});   // TODO-DWEB make this an array of Member and allow TileImage to take member=Member
        })
        .catch((err) => {
          debug("Related service failed err= %s", err.message);
          this.setState({related: []});
        });
  }

  render () {
    if (!this.state.related) {
      return <div>Related items loading...</div>
    }

    const horizontalScrollStyling = {
      width: '100%',
      overflowX: 'scroll',
      margin: 'auto',
    }; //whiteSpace: 'nowrap' makes text overlap - let Richard fix this
    const paraStyling = { whiteSpace: 'wrap'};
    let children = this.state.related.map((row) => {
      //TODO-DWEB needs to add item to img
      return <li style={{display: 'inline-block', margin: '1rem', maxWidth: 200}} key={row._id} >
        <a href={`?identifier=${row._id}`}>
          <TileImage identifier={row._id} />
          <p>{ row._source.title[0] }</p>
        </a>
      </li>
    })
    if (children.length === 0) {
      children.push(<li key="RELATED">[related]</li>)
    }
    return <div>
      <h2>Related</h2>
      <ul style={horizontalScrollStyling}>{children}</ul>
    </div>
  }
}