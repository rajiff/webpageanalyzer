import React,{Component} from 'react';
import PropTypes from 'prop-types';

import WebDocHeadingsDetails from './WebDocHeadingsDetails';
import WebDocLinksDetails from './WebDocLinksDetails';

import request from 'superagent';
import moment from 'moment';

import { Grid, Row, Col } from 'react-flexbox-grid';
import Divider from 'material-ui/Divider';
import Link from 'material-ui/svg-icons/content/link';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionDoneAll from 'material-ui/svg-icons/action/done-all';

export default class WebDocDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      webDoc: undefined
    }
  }

  static propTypes = {
    url: PropTypes.string.isRequired
  }

  componentDidMount() {
    this.loadWebDocument();
  }

  normalizeHTTPError = (err) => {
    let msg = "";

    if (err) {
      console.log("Error in accessing web page, ERROR::", err);

      if (err.code === "ENOTFOUND") {
        msg = `Requested resource not found, error ${err.code}`;
      } else if (err.code === "ECONNABORTED" || err.code === "ECONNREFUSED") {
        msg = `Requested resource took more more than expected time to respond or connection refused, error ${err.code}`;
      } else {
        msg = `Unexpected error in accessing requested resource ${err.code || err.status || ''}`;
      }
    }

    return msg;
  }

  loadWebDocument = () => {
    this.setState({
      queryInProgress: true,
      errorMessage: '',
      userMessage: ''
    });

    let apiURL = `/metadata/api/v1/webdocuments/${encodeURIComponent(this.props.url)}`;

    request
    .get(apiURL)
    .end((err, res) => {
      if(err){
        let msg = this.normalizeHTTPError(err);

        if(err) return this.setState({ errorMessage: msg});
      } else {
         this.setState({
          webDoc: res.body,
          queryInProgress: false
        });
      }
    });
  }

  getWebDocMetaDataBlock = () => {
    return (
      <div>
          <Row>
            <Col xs={12}>
            {
              (this.state.errorMessage || '')
            }
            </Col>
          </Row>
          <Row middle="xs">
            <Col center="xs" xs={11}>
              <h3>{this.state.webDoc.title}</h3>
            </Col>
          </Row>
          <Row middle="xs">
            <Col center="xs" xs={1}>
              <Link/>
            </Col>
            <Col xs={11}>
              <span style={{color: 'blue'}}>{this.state.webDoc.url}</span>
            </Col>
          </Row>
          <Row middle="xs">
            <Col center="xs" xs={4}>
              {'Version: ' + this.state.webDoc.htmlversion}
            </Col>
            <Col xs={4}>
              {'Content-type ' + this.state.webDoc.contenttype}
            </Col>
            <Col xs={4}>
              {(this.state.webDoc.accessstatus/100 !== 2)?<span style={{color:'red'}}>{this.state.webDoc.statusmessage}</span>:''}
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              {(!this.state.webDoc.analyzedon)?'Pending for analysis..':''}
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              {(this.state.webDoc.analyzedon)?
                <span><ActionDoneAll style={{height: "16px", width: "16px"}}/>{moment(this.state.webDoc.analyzedon).calendar()}</span>
                :
                <span><ActionDone style={{height: "16px", width: "16px"}}/>{moment(this.state.webDoc.submittedon).calendar()}</span>
              }
            </Col>
          </Row>
      </div>
    )
  }

  render() {
  	return (
      <Grid fluid>

        <Row>
          <Col xs={12}>
            {(this.state.webDoc)?this.getWebDocMetaDataBlock():''}
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <h3>{"Headings"}</h3>
            <Divider />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            {(this.state.webDoc && this.state.webDoc.analyzedon)?<WebDocHeadingsDetails url={this.props.url}/>:'Not yet available'}
          </Col>
        </Row>
        <Row >
          <Col xs={12}>
            <h3>{"Links"}</h3>
            <Divider />
          </Col>
        </Row>
        <Row >
          <Col xs={12}>
            {(this.state.webDoc && this.state.webDoc.analyzedon)?<WebDocLinksDetails url={this.props.url}/>:'Not yet available'}
          </Col>
        </Row>
      </Grid>
    )
  }
}