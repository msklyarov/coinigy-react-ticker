import React from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { format } from 'date-fns';
import styled from 'styled-components';
import socketCluster from 'socketcluster-client';

const PaperContainer = styled.div`
  max-width: 25em;
  margin: auto;
  margin-top: 3em;
  padding-top: 2em;
`;

function* dataGenerator(data) {
  yield* data;
}

const pollInterval = 10000; // in ms

class ViewData extends React.Component {
  state = { data: {} };

  componentDidMount() {
    const { apiKey, apiSecret, channelId } = this.props;

    const options = {
      hostname  : "sc-02.coinigy.com",
      port      : "443",
      secure    : "true"
    };

    const SCsocket = socketCluster.connect(options);

    SCsocket.on('connect', () => {
      SCsocket.on('error', err =>  console.log(err));

      SCsocket.emit("auth", { apiKey, apiSecret }, (err, token) => {
        if (!err && token) {
          const scChannel = SCsocket.subscribe(channelId);

          scChannel.watch((data) => {
            let timerId = null;
            clearInterval(timerId);

            const timeToShowData = pollInterval / data.Data.length;
            const gen = dataGenerator(data.Data);

            timerId = setInterval(() => {
              const result = gen.next();
              if (!result.done) {
                this.setState({ data: result.value })
              } else {
                clearInterval(timerId);
              }
            }, timeToShowData);
          });
        } else {
          console.log(err)
        }
      });
    });
  }

  render() {
    return (
      <PaperContainer>
        <Typography variant="h5" component="h3">
          Coinigy Price Ticker
        </Typography>
        <Table style={{marginTop: '1em'}}>
          <TableHead>
            <TableRow>
              <TableCell>Parameter</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>request</TableCell>
              <TableCell>{format(new Date(), 'YYYY-MM-DD hh:mm:ss')}</TableCell>
            </TableRow>
            {Object.entries(this.state.data).map((entry, i) =>
              <TableRow key={i}>
                <TableCell>{entry[0]}</TableCell>
                <TableCell>{entry[1]}</TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </PaperContainer>
    );
  }
}

export default ViewData;