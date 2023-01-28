import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";


export default function Appointment(props) {

  return (
    <article className="appointment">
      <Header time={props.time} />
      {props.interview ?
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        /> :
        <Empty />}
    </article>
  );
};

/*
return (props.yourName ? <h1>Hello, {props.yourName}.</h1> : <h1>Sorry, you don't seem to have a name.</h1>);

If props.interview (an interview object) is truthy the <Appointment> 
will render the <Show> component, else it should render the <Empty> component.

*/
