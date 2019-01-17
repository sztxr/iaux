import React from 'react'
import PropTypes from 'prop-types'

export default class extends React.Component {

    constructor (props) {
        super(props);
        this._isMounted = false
    }

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
        this._isMounted = true;
    }

}