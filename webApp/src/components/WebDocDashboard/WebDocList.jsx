import React,{Component} from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { Grid, Row, Col } from 'react-flexbox-grid';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Public from 'material-ui/svg-icons/social/public';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionDoneAll from 'material-ui/svg-icons/action/done-all';

export default class WebDocList extends Component {
  constructor(props) {
    super(props);

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

  getDocList = () => {
    return this.props.docs.map((webDoc) => {
      // console.log(webDoc)
      return (
        <div key={webDoc.url}>
          <ListItem
            leftAvatar={<Public style={{height: "36px", width: "36px"}} color={this.accessColors[(webDoc.accessstatus/100)]}/>}
            primaryText={<span>{webDoc.title} <a href={webDoc.url} target={"_blank"}>{webDoc.url}</a></span>}
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
          />
          <Divider inset={true}/>
        </div>
    )})
  }

  render() {
    return(
      <Grid fluid style={{padding: "0px 8px 0px 8px"}}>
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
