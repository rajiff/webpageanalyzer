import React,{Component} from 'react';
import PropTypes from 'prop-types';

/*import moment from 'moment';

import { Grid, Row, Col } from 'react-flexbox-grid';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionDoneAll from 'material-ui/svg-icons/action/done-all';
*/
export default class WebDocHeadingsDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  static propTypes = {
    url: PropTypes.string.isRequired
  }

  render() {
  	return (<div>{this.props.url}</div>)
  }
}