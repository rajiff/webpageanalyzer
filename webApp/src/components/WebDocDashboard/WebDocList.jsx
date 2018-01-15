import React,{Component} from 'react';
import PropTypes from 'prop-types';

import WebDocDetails from './WebDocDetails';

import moment from 'moment';

import { Grid, Row, Col } from 'react-flexbox-grid';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Public from 'material-ui/svg-icons/social/public';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionDoneAll from 'material-ui/svg-icons/action/done-all';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class WebDocList extends Component {
  constructor(props) {
    super(props);

    this.state={
      openWebDocDetailsDialog: false,
      showDetailsForURL: undefined
    }

    this.styles = {
      customStyle : {
        width: '80%',
        maxWidth: '100%'
      }
    }

    this.accessColors = {
      0: 'Grey',
      1: 'Brown',
      2: 'Blue',
      3: 'Orange',
      4: 'Brown',
      5: 'Red'
    }
  }

  static propTypes = {
    docs: PropTypes.array.isRequired
  }

  handleWebDocSelect = (webDocURL) => {
    this.setState({openWebDocDetailsDialog: true, showDetailsForURL: webDocURL});
  }

  handleWebDocDetailsDialogClose = () => {
    this.setState({openWebDocDetailsDialog: false});
  }

  getWebDocDetailsDialog = () => {
    return (
      <Dialog
        title={`Analysis of : ${this.state.showDetailsForURL}`}
        modal={false}
        open={this.state.openWebDocDetailsDialog}
        actions={[<FlatButton label="Cancel" primary={true} onClick={this.handleWebDocDetailsDialogClose}/>]}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        contentStyle={this.styles.customStyle}
        onRequestClose={this.handleWebDocDetailsDialogClose}
      >
        <WebDocDetails url={this.state.showDetailsForURL} />
      </Dialog>
    )
  }

  getDocList = () => {
    return this.props.docs.map((webDoc) => {
      return (
        <div key={webDoc.url}>
          <ListItem
            leftAvatar={<Public style={{height: "36px", width: "36px"}} color={this.accessColors[(webDoc.accessstatus/100)]}/>}
            primaryText={<span><a href={webDoc.url} target={"_blank"}>{`${webDoc.title} ${webDoc.url}`}</a></span>}
            secondaryTextLines={2}
            secondaryText={
              <p>
                {(webDoc.htmlversion) ? `${webDoc.htmlversion},`:""} {(webDoc.contenttype) ? `${webDoc.contenttype},`:""} {(webDoc.accessstatus/100 !== 2)?<span style={{color:'red'}}>{webDoc.statusmessage}</span>:''} {(!webDoc.analyzedon)?<span>{'pending for analysis..'}</span>:''}
                <br/>
                {(webDoc.analyzedon)?
                  <span><ActionDoneAll style={{height: "16px", width: "16px"}}/>{moment(webDoc.analyzedon).calendar()}</span>
                  :
                  <span><ActionDone style={{height: "16px", width: "16px"}}/>{moment(webDoc.submittedon).calendar()}</span>
                }
              </p>
            }
            onClick={this.handleWebDocSelect.bind(this, webDoc.url)}
          />
          <Divider inset={true}/>
        </div>
    )})
  }

  render() {
    return(
      <Grid fluid style={{padding: "0px 8px 0px 8px"}}>
        <Row>
          <Col xs={11}>
          {(this.state.openWebDocDetailsDialog) ? this.getWebDocDetailsDialog():''}
          </Col>
        </Row>

        <Row center="xs">
          <Col xs={11}>
            {
              (this.props.docs.length) ? '':<h3>{'You seems to have not analyzed any web document, add a new URL to analyze, Eg: http://google.com'}</h3>
            }
          </Col>
        </Row>

        <Row >
          <Col xs={11}>
            <List>
              {this.getDocList()}
            </List>
          </Col>
        </Row>
      </Grid>
      )
  }
}
