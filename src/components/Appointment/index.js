import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Status from "components/Appointment/Status";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "FORM";
  const STATUS = "STATUS";
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    // Pessimistic User Flow, show 'saving' image while posting to server
    transition(STATUS);
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW));
  };

  function deleteAppointment() {
    transition(STATUS);
    props.cancelInterview(props.id)
    .then(() => transition(SHOW));
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => console.log("Clicked onEdit")}
          onDelete={deleteAppointment}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === STATUS && <Status message="Saving" />}
    </article>
  );
};
