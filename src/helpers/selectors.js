/* 
 * Function receives days and appointment objects in state
 * and the name of the given day.
 * 
 * Returns an array of the appointment objects for the given day
 * in the form: [ { id: 4, time: '3pm', interview: null },
 *                {
 *                  id: 5,
 *                  time: '4pm',
 *                  interview: { student: 'Chad Takahashi', interviewer: 2 }
 *                } ]
 */
export function getAppointmentsForDay(state, day) {

  // Return an empty array if the days data is empty
  if (state.days.length === 0) {
    return [];
  }

  // Filter the data for the given day only
  const filteredDays = state.days.filter(dayObject => dayObject.name === day);

  // If the given day is not found, return an empty array
  if (filteredDays.length === 0) {
    return [];
  }

  // Get the array of appointment IDs from the day object
  const appointmentIds = filteredDays[0].appointments;

  // Add each appointment to return array
  const appointmentsForDay = [];
  for (const appointmentId of appointmentIds) {
    appointmentsForDay.push(state.appointments[appointmentId]);
  }

  return appointmentsForDay;
};

/*
 * Function receives state and a given interview.
 *
 * Returns an interview object containing all of the interviewer details:
 * {  
 *  "student": "Lydia Miller-Jones",
 *  "interviewer": {  
 *  "id": 1,
 *  "name": "Sylvia Palmer",
 *  "avatar": "https://i.imgur.com/LpaY82x.png"
 * }
}
 */
export function getInterview(state, interview) {
  // If there is no interview (state.appointments[id].interview is null), return null
  if (!interview) {
    return null;
  }
  // If we have an interview, return an object as specified
  const interviewerId = interview.interviewer;
  const interviewerObject = state.interviewers[interviewerId];
  return {...interview, interviewer: interviewerObject};
};

/* 
 * Function receives days and interviewers objects in state
 * and the name of the given day.
 * 
 * Returns an array of the interviwers objects for the given day
 * in the form: [ {
 *                  id: 2,
 *                  name: "Tori Malcolm",
 *                  avatar: "https://i.imgur.com/Nmx0Qxo.png"
 *                } ]
 */
export function getInterviewersForDay(state, day) {

  // Return an empty array if the days data is empty
  if (state.days.length === 0) {
    return [];
  }

  // Filter the interviewers data for the given day only
  const filteredDays = state.days.filter(dayObject => dayObject.name === day);

  // If the given day is not found, return an empty array
  if (filteredDays.length === 0) {
    return [];
  }

  // Get the array of appointment IDs from the day object
  const interviewerIds = filteredDays[0].interviewers;

  // Add each appointment to return array
  const interviewersForDay = [];
  for (const interviewerId of interviewerIds) {
    interviewersForDay.push(state.interviewers[interviewerId]);
  }

  return interviewersForDay;
};
