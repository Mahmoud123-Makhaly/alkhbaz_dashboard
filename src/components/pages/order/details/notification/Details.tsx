'use client';

import { Card, CardBody, Col, Row } from 'reactstrap';
import { INotification } from '@app/types';
import { DisplayDateText } from '@components/common';

const Details = ({ data }: { data: INotification }) => {
  return (
    <Row>
      <Col>
        <Card className="mb-3" dir="ltr">
          <CardBody>
            <div className="table-card">
              <table className="table mb-0">
                <tbody>
                  <tr>
                    <td className="fw-medium">Message ID</td>
                    <td>#{data.id}</td>
                  </tr>
                  <tr>
                    <td className="fw-medium">Created at</td>
                    <td>
                      <DisplayDateText date={data.createdDate?.toString()} />
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-medium">Status</td>
                    <td>
                      <span className={`badge badge-soft-${data.status === 'Error' ? 'danger' : 'primary'}`}>
                        {data.status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-medium">From</td>
                    <td>{data.from}</td>
                  </tr>
                  <tr>
                    <td className="fw-medium">To</td>
                    <td>{data.to}</td>
                  </tr>
                  <tr>
                    <td className="fw-medium">CC</td>
                    <td>{data.cc}</td>
                  </tr>
                  <tr>
                    <td className="fw-medium">BCC</td>
                    <td>{data.bcc}</td>
                  </tr>
                  <tr>
                    <td className="fw-medium">Sending Attempts</td>
                    <td>{data.sendAttemptCount}</td>
                  </tr>
                  <tr>
                    <td className="fw-medium">Errors</td>
                    <td>{data.lastSendError}</td>
                  </tr>
                  <tr>
                    <td className="fw-medium">Subject</td>
                    <td>{data.subject}</td>
                  </tr>
                  <tr>
                    <td className="fw-medium">Body</td>
                    <td>{data.body}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
export default Details;
