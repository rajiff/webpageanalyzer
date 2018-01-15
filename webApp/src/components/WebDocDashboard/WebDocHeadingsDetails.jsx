import React,{Component} from 'react';
import PropTypes from 'prop-types';

import request from 'superagent';

import { Grid, Row, Col } from 'react-flexbox-grid';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
// import Title from 'material-ui/svg-icons/editor/title';

export default class WebDocHeadingsDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      webDocHeadingsColln: []
    }
  }

  static propTypes = {
    url: PropTypes.string.isRequired
  }

  componentDidMount() {
    this.loadWebDocHeadings();
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

  loadWebDocHeadings = () => {
    this.setState({
      queryInProgress: true,
      errorMessage: '',
      userMessage: ''
    });

    let apiURL = `/docheadings/api/v1/webdocheadings/${encodeURIComponent(this.props.url)}`;

    request
    .get(apiURL)
    .end((err, res) => {
      if(err){
        let msg = this.normalizeHTTPError(err);

        if(err)
          this.setState({ errorMessage: msg, queryInProgress: false});
      } else {
         this.setState({
          webDocHeadingsColln: res.body,
          queryInProgress: false
        });
      }
    });
  }

  groupDocHeadingByLevel = () => {
    let docHeadingsByLevel = {
      "h1": [],
      "h2": [],
      "h3": [],
      "h4": [],
      "h5": [],
      "h6": []
    }

    this.state.webDocHeadingsColln.forEach((dh) => {
      docHeadingsByLevel[dh.heading.toLowerCase()].push(dh);
    });

    return docHeadingsByLevel;
  }

  getDocHeadingsBlock = () => {
    let docHeadingsByLevel = this.groupDocHeadingByLevel();
    let headingLabels = Object.keys(docHeadingsByLevel);

    return headingLabels.map((heading) => {
      if(!docHeadingsByLevel[heading].length) return ( '' )

      return (
        <div key={heading}>
          <ListItem
            primaryText={heading.toUpperCase()}
            secondaryTextLines={2}
            secondaryText={<p>{`${docHeadingsByLevel[heading].length} headings found`}</p>}
            nestedItems={this.getDocHeadingsElements(docHeadingsByLevel[heading])}
          />
          <Divider inset={true}/>
        </div>
      )
    })
  }

  getDocHeadingsElements = (docHeadingItems) => {
    if(!docHeadingItems.length) return ('');

    return docHeadingItems.map((dh, index) => {
      return ( <ListItem key={index} primaryText={ (dh.headingtext || ' - no heading text found - ') }/> )
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
              `Found ${this.state.webDocHeadingsColln.length} number of headings`
            }
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            {
              (this.state.webDocHeadingsColln.length)?<List>{this.getDocHeadingsBlock()}</List>:'No headings found..!'
            }
          </Col>
        </Row>
      </Grid>
    )
  }
}