import React,{Component} from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AppBar from 'material-ui/AppBar';

import Dialog from 'material-ui/Dialog';

import InfiniteScroll from 'react-infinite-scroller';
import LinearProgress from 'material-ui/LinearProgress';

import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';

import request from 'superagent';
import WebDocList from './WebDocList';

export default class WebDocHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      webDocColln: [],
      pageStart: 1,
      hasMore: false,
      errorMessage: "test",
      userMessage: "test",
      docURL: "",
      handleDocURLTextError: "",
      collnQueryInProgress: false,
      openAddNewDialog: false
    }

    this.styles = {
      errorMsg: {
        color: 'red'
      },
      pgTitle : {
        fontSize: "18px",
        margin: "20px auto auto 5px",
        padding: "0px",
        fontWeight: "600"
      },
      errorMessage : {
        background: '#f1f1f1',
        color: "red",
        padding: "8px",
        fontSize: "14px",
        borderRadius: "8px"
      },
      userMessage : {
        background: '#f1f1f1',
        color: "green",
        padding: "8px",
        fontSize: "14px",
        borderRadius: "8px"
      }
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

  analyzeNewURL = (done) => {
    if(!this.state.docURL) return;

    let apiURL = `/metadata/api/v1/webdocuments`;
    let newWebDoc = { url: this.state.docURL };

    request
    .post(apiURL)
    .set('Content-Type', 'application/json')
    .send(newWebDoc)
    .end((err, res) => {
      let errMsg = null;
      if(err){
        errMsg = this.normalizeHTTPError(err);
      }
      let webDocObj = res.body;
      done(errMsg, webDocObj);
    });
  }

  loadWebDocs = (page) => {
    this.setState({
      collnQueryInProgress: true,
      errorMessage: '',
      userMessage: ''
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

        if(err) return this.setState({ errorMessage: msg});
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

  handleAddNewURL = () => {
    this.setState({openAddNewDialog: true});
  }

  handleAddNewURLDialogClose = () => {
    this.setState({openAddNewDialog: false});
  }

  handleDocURLTextChange = (event, value) => {
    // Validate the URL
    let error = "";
    let urlStr = value;

    // let urlPattern = new RegExp('/^https?://.+/gi');
    // error = (urlPattern.test(urlStr))?'':'Please specify valid URL';

    this.setState ({
      docURL : urlStr,
      handleDocURLTextError: error
    });
  }

  handleAnalyzeNewURL = () => {
    this.analyzeNewURL((err, webDocObj) => {
      if(!err) {
        let webDocs = this.state.webDocColln;

        // Add at top, so that user knows about new web doc
        webDocs.unshift(webDocObj);

        this.setState({
          docURL: "",
          openAddNewDialog: false,
          errorMessage: '',
          userMessage: `Successfully submitted analysis request, check after some time (2 second)..!`,
          webDocColln: webDocs
        });
      } else {
        this.setState({
          docURL: "",
          openAddNewDialog: false,
          errorMessage: `Error occurred ${err}`,
          userMessage: ''
        });
      }
    });
  }

  getAddNewURLDialog = () => {
    return (
      <Dialog
        title="Analyze new web page"
        modal={true}
        open={this.state.openAddNewDialog}
        actions={[
          <FlatButton label="Cancel" primary={false} onClick={this.handleAddNewURLDialogClose}/>,
          <FlatButton label="Analyze" primary={true} onClick={this.handleAnalyzeNewURL}/>
        ]}
      >
        <h4>You are about to submit a URL for analysis, this may take few seconds to analyze</h4>
        <p>
          PS: Only accessible URLs with content-type `text/html` are analyzed
        </p>
        <TextField
          type="url"
          pattern="https?://.+/gi"

          floatingLabelFixed={false}
          floatingLabelText="Web page (URL) to analyze"
          floatingLabelStyle={{"fontSize": "16px"}}

          hintText="Specify URL of web page to analyze"
          hintStyle={{"fontSize": "22px"}}

          errorText={this.state.handleDocURLTextError}
          value={this.state.docURL}
          onChange={this.handleDocURLTextChange}

          fullWidth={true}
          style={{"height": "100px"}}
          inputStyle={{"fontSize": "22px"}}

        />
      </Dialog>
    )
  }

  render() {
    return(
      <Grid fluid style={{padding: "0px 8px 0px 8px"}}>
        <Row>
          <Col xs={12}>

            <Row>
              <AppBar title="Web Page Analyzer" showMenuIconButton={false}/>
            </Row>

            <Row start="xs">
              <Col xs={10}>
                <div style={this.styles.pgTitle}>
                  {"Latest web pages analyzed"}
                </div>
              </Col>
            </Row>

            <Row end="xs">
              <Col xs={2}>
                <Row middle="xs" end="xs">
                  <Col xs={10}>
                    <FloatingActionButton onClick={this.handleAddNewURL}>
                      <ContentAdd />
                    </FloatingActionButton>
                    {this.getAddNewURLDialog()}
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row center="xs">
              <Col xs={6}>
                {
                  (this.state.errorMessage)?
                    <h6 style={this.styles.errorMessage}>{(this.state.errorMessage?this.state.errorMessage:'')}</h6>
                  :
                    ''
                }
              </Col>
            </Row>

            <Row center="xs">
              <Col xs={6}>
                {
                  (this.state.userMessage)?
                    <h6 style={this.styles.userMessage}>{(this.state.userMessage?this.state.userMessage:'')}</h6>
                  :
                    ''
                }
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
