import React from 'react'
import PropTypes from 'prop-types'

export default class extends React.Component {

    constructor (props) {
        super(props);
        this._isMounted = false; // This flag is needed so that dweb under ReactFake can tell if a component is mounted
    }

    /* This was needed in the dweb because we didn't know if the component was mounted, and had to set State in two different ways
       If this causes problems in React, it can be commented out as its not clear exactly where in Dweb it causes a problem.
     */
    setState(res) {
        if (this._isMounted) {
            super.setState(res);
        } else {
            Object.keys(res).forEach(k => this.state[k] = res[k]);
            // renderFakeElement is set in ReactFake to the element created, so it can be removed from React and then updated
            // it causes the item to be rerendered when setState is called e.g. after data is retrieved
            //if (typeof DwebArchive !== "undefined" && typeof this.renderFakeElement !== "undefined") { DwebArchive.ReactFake.renderRealReact(this, this.renderFakeElement.parentNode);  }
        }
    }
    componentDidMount() {
        // super this, so that Dweb knows when component mounted
        this._isMounted = true;
    }

}