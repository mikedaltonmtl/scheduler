import React from "react";
import { render, cleanup } from "@testing-library/react";
import Appointment from "components/Appointment";

afterEach(cleanup);

/* Props check:
<Appointment
  key={appointment.id}
  id={appointment.id}
  time={appointment.time}
  interview={interview}
  interviewers={dailyInterviewers}
  bookInterview={bookInterview}
  cancelInterview={cancelInterview}
/>

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};
*/

describe("Appointment", () => {

  it("renders without crashing", () => {
    render(<Appointment />);
  });

  it("does something it is supposed to do", () => {
    // ...
  });

  it("does something else it is supposed to do", () => {
    // ...
  });

}); // end of describe