const SET_DAY = "SET_DAY";
const SET_DAYS = "SET_DAYS"
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {

  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day };
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      };
    case SET_DAYS:
      return { ...state, days: action.days };
    case SET_INTERVIEW:
      // Don't update state immediately, wait to update days object too (to avoid stale state)
      // Prepare a new state object with an updated appointments object
      const updatedState = { ...state, appointments: action.appointments };
      // Get the updated days object
      const updatedDays = updateSpots(updatedState, action.id);
      // Update the new state object with the new days object
      updatedState.days = updatedDays;
      // Update state with both of the changed objects
      return updatedState;
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
};

// Function will receive the current state and update the spots count in the days object
// It will NOT update state direcly, but will return an up to date days object to be put in state
function updateSpots(state, id) {
  let emptySpots = 0;
  let dayName = state.day;
  /**
   * If an appointment has been changed by a different browser (because of WebSockets functionality),
   * the day.name in state may be different to that of this browser, so we need to use the
   * appointment id to get the day (dayName) whose spots need to be updated
  */ 
  if (id) {
    for (const updatedDay of state.days) {
      if (updatedDay.appointments.includes(id)) {
        dayName = updatedDay.name;
        break;
      }
    }
  }

  const newDays = state.days.map(day => {
    // Use our appointment id to find the current day
    if (day.name === dayName) {
      // We have the day, now we can iterate over it's appointments array
      for (const appointmentId of day.appointments) {
        // Each null interview is an empty spot
        if (state.appointments[appointmentId].interview === null) {
          emptySpots ++;
        }
        // Update the number of empty spots in the day object
        day.spots = emptySpots;
      }
    }
    return day;
  });
  return newDays;
};

export { SET_DAY, SET_DAYS, SET_APPLICATION_DATA, SET_INTERVIEW };