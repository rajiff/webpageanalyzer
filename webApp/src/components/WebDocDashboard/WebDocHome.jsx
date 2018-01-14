import React,{Component} from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AppBar from 'material-ui/AppBar';

import InfiniteScroll from 'react-infinite-scroller';
import LinearProgress from 'material-ui/LinearProgress';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import request from 'superagent';
import WebDocList from './WebDocList';

export default class WebDocHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      webDocColln: [],
      pageStart: 1,
      hasMore: false,
      error: "",
      collnQueryInProgress: false
    }
  }

  componentDidMount() {
    this.setState({collnQueryInProgress: true});
    this.loadWebDocs();
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

  loadWebDocs = (page) => {
    this.setState({
      collnQueryInProgress: true,
      error: ''
    });

    if(!page) {
      page = 1;
    }

    let apiURL = `/metadata/api/v1/webdocuments/?pg=${page}`;

    request
    .get(apiURL)
    .end((err, res) => {
      if(err){
        let msg = this.normalizeHTTPError(err);

        if(err) return this.setState({ error: msg});
      } else {
        let webDocs = this.state.webDocColln;

        // for pagination if the page number is one (or) first time it getting the collection
        // then it will remove the state collection which already exist
        if(page === 1){
          webDocs = [];
        }

        // Append the returned results to list, helpful in case of pagination
        webDocs = webDocs.concat(res.body);

         this.setState({
          webDocColln: webDocs,
          collnQueryInProgress: false,
          // totalWebDocs: res.body.total,
          pageStart: page,
          // hasMore: (webDocColln.length < res.body.total)
        });
      }
    });

  }

  loadNextPage = (page) => {
    this.loadWebDocs(page);
  }

  render() {
    return(
      <Grid fluid style={{padding: "0px 8px 0px 8px"}}>
        <Row>
          <Col xs={12}>

            <Row>
              <AppBar title="Web Page Analyzer" showMenuIconButton={false}/>
            </Row>

            <Row middle="xs" end="xs">
              <Col xs={1}>
                <FloatingActionButton>
                  <ContentAdd />
                </FloatingActionButton>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <WebDocList docs={this.state.webDocColln} />
              </Col>
            </Row>

            <InfiniteScroll
                  pageStart={this.state.pageStart}
                  loadMore={this.loadNextPage.bind(this)}
                  hasMore={this.state.hasMore}
                  loader={<div style={{padding: "50px"}}><LinearProgress mode="indeterminate"/></div>}>
                  { <div></div> }
            </InfiniteScroll>


          </Col>
        </Row>
      </Grid>
      )
  }
}
