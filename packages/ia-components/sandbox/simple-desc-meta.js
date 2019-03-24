require('babel-core/register')({presets: ['env', 'react']}); // ES6 JS below!
import IAReactComponent from './IAReactComponent.js';
import PropTypes from 'prop-types'
import { Item } from 'ia-js-client'

export default class extends IAReactComponent {

  /*
  static propTypes = {
    item: PropTypes.instanceOf(Item).isRequired
  }
  */
  constructor (props) {
    super(props)

    this.state = {
      metadata: props.item.metadataCache || null, // DWEB: setting to props.item.metadataCache which may already be initialized as the react element is never mounted in the Dweb scenario
    }

    props.item.getMetadata().then(metadata => {
      this.setState({metadata: metadata}) //DWEB: Note this is going to be ignored in the Dweb case as React doesnt get to re-render it BUT metadata is always fetched before render is called
    })
  }

  render () {
    if (!this.state.metadata) {
      return <div>Metadata Loading...</div>
    }
    let displayableMetadata = {... this.state.metadata.metadata} //2RICHARD: The result of the promise is a RawMetaDataResponse, not Metadata I fixed it

    // ['description'].forEach(key => {
    //   console.log(key)
    //   // if (typeof displayableMetadata[key] !== undefined)
    //   //   delete displayableMetadata[key]
    // })

    delete displayableMetadata.description

    let description = ''
    if (this.state.metadata.metadata.description) { //2RICHARD same fix as above
      description = this.state.metadata.metadata.description.join(' ')  //2RICHARD same fix as above
    }
    // TODO sort metadata alphabetically

    return <div>
      <div
          dangerouslySetInnerHTML={{__html: description}} //TODO-DWEB need to preprocess so catches images like dweb.archive does - see "commute" for an example
      />
      <div className="simple-desc-meta__meta">
        <h3>Metadata</h3>
        <table className="table">
          <tbody>
          {Object.keys(displayableMetadata).map((key) => {
            return <tr key={key}>
              <td>{key}</td>
              <td>{displayableMetadata[key].join('; ')}</td>
            </tr>
          })}
          </tbody>
        </table>
      </div>
    </div>
  }
}