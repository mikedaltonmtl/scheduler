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