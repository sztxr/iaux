import IAReactComponent from './IAReactComponent.js';
import PropTypes from 'prop-types'

export default class extends IAReactComponent { //TODO-DWEB this should probably be extends IAReactComponent

    static propTypes = {
        identifier: PropTypes.string.isRequired,
        member: PropTypes.object, // Unused currently
        className: PropTypes.string, // Not sure what type this is
        imgname: PropTypes.string,
    };

    constructor(props)
    {
        super(props);
        this.state = { }
        this.loadImg = (enclosingspan) => // Defined as a closure so that can access identifier
            DwebArchive.ReactFake.p_loadImg(enclosingspan, "__ia_thumb.jpg", `/services/img/${props.identifier}`) ////Intentionally no host so ReactFake will process
    }


    render() {
        if (typeof DwebArchive !== "undefined") {
            //TODO-DWEB build img processing from ReactFake into tile-tile-image and ParentTileImg but wait till have non-tile images as well
            const self = this;
            return <span className={this.props.className} imgname={this.props.imgname} ref={this.loadImg}></span>
        } else {
            return <img src={`https://archive.org/services/img/${this.identifier}`}/>;
        }
    }
}
