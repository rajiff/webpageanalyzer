import React,{Component} from 'react';
import PropTypes from 'prop-types';

import request from 'superagent';

import { Grid, Row, Col } from 'react-flexbox-grid';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';

export default class WebDocLinksDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      webDocLinkColln: []
    }
  }

  static propTypes = {
    url: PropTypes.string.isRequired
  }

  componentDidMount() {
    this.loadWebDocLinks();
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

  loadWebDocLinks = () => {
    this.setState({
      queryInProgress: true,
      errorMessage: '',
      userMessage: ''
    });

    let apiURL = `/doclinks/api/v1/webdoclinks/${encodeURIComponent(this.props.url)}`;

    request
    .get(apiURL)
    .end((err, res) => {
      if(err){
        let msg = this.normalizeHTTPError(err);

        if(err)
          this.setState({ errorMessage: msg, queryInProgress: false});
      } else {
         this.setState({
          webDocLinkColln: res.body,
          queryInProgress: false
        });
      }
    });
  }

  getDocLinksBlock = () => {
    if(!this.state.webDocLinkColln.length) return ( '' )

    return this.state.webDocLinkColln.map((docLink, index) => {
      return (
        <div key={docLink.hyperlink}>
          <ListItem
            leftAvatar={<Avatar size={28} backgroundColor={'indigo'}>{index+1}</Avatar>}
            primaryText={<a href={(docLink.linksource === 'internal')?`${docLink.url}${docLink.hyperlink}`:`${docLink.url}`} target="_blank">{docLink.hyperlink}</a>}
            secondaryTextLines={2}
            secondaryText={
              <p>
                {(docLink.linksource) ? `${docLink.linksource}, `:""}
                {(docLink.contenttype) ? `${docLink.contenttype}, `:""}
                {(docLink.accessstatus/100 !== 2)?<span style={{color:'red'}}>{docLink.statusmessage}</span>:''}
              </p>
            }
          />
          <Divider inset={true}/>
        </div>
      )
    })
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col xs={12}>
            {
              (this.state.errorMessage || '')
            }
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            {
              `Found ${this.state.webDocLinkColln.length} number of distinct links`
            }
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            {
              (this.state.webDocLinkColln.length)?<List>{this.getDocLinksBlock()}</List>:'No links found..!'
            }
          </Col>
        </Row>
      </Grid>
    )
  }
}