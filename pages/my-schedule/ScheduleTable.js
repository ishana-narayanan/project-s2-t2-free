import useSWR from "swr";
import { useCallback, useState } from "react";
import { useToasts } from "../../components/Toasts";
import Table from "react-bootstrap/Table";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";

function dayOfTheWeek(param) {
  let day = "";
  if (param.isSunday == true) {
    day += "Sun  ";
  }
  if (param.isMonday == true) {
    day += "Mon  ";
  }
  if (param.isTuesday == true) {
    day += "Tues  ";
  }
  if (param.isWednesday == true) {
    day += "Wed  ";
  }
  if (param.isThursday == true) {
    day += "Thur  ";
  }
  if (param.isFriday == true) {
    day += "Fri  ";
  }
  if (param.isSaturday == true) {
    day += "Sat";
  }
  return day;
}

function createTable(data) {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const { showToast } = useToasts();
  const { mutate } = useSWR("/api/event");

  const deleteId = useCallback(async (eventId) => {
    // showToast(`Deleted event ${data.find((u) => u._id === eventId)?.name}`);
    await fetch(`/api/event/${eventId}`, { method: "DELETE" });
    await mutate();
  }, []);

  if (typeof data === "object") {
    const items = [];

    for (let i = 0; i < data.length; i++) {
      items.push(
        <tr>
          <td>{data[i].name}</td>
          <td>{dayOfTheWeek(data[i])}</td>
          <td>{data[i].startTime}</td>
          <td>{data[i].endTime}</td>
          <td>
            {isDeleteMode && (
              <Form.Group>
                <Button
                  variant="danger"
                  onClick={() => deleteEvent(data[i]._id)}
                >
                  Delete
                </Button>
              </Form.Group>
            )}
          </td>
        </tr>
      );
    }

    return (
      <Table striped bordered className="mt-3">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Day of the Week</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>
              <Form.Check
                label="Delete"
                type="switch"
                id="isDeleteMode"
                onChange={(e) => setIsDeleteMode(e.target.checked)}
              />
            </th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </Table>
    );
  }
}

export default function ScheduleTable() {
  // const { showToast } = useToasts();
  // const { data } = useSWR("/api/event");
  const { data } = useSWR("/api/event");
  return <div>{createTable(data)}</div>;
}
