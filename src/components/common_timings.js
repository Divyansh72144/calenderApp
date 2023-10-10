import React from "react";
import moment from "moment";

function CommonAvailableDays({ users }) {
  // Function to calculate common available days
  const calculateCommonAvailableDays = () => {
    // Create an array of all user's free time slots
    const userFreeTimeSlots = users.map((user) => user.freeTimeSlots);

    // Check if userFreeTimeSlots is empty
    if (userFreeTimeSlots.length === 0) {
      return [];
    }

    // Find the intersection of all user's free time slots
    const commonAvailableDays = userFreeTimeSlots.reduce(
      (common, userSlots) => {
        return common.filter((day) => userSlots.includes(day));
      },
      [...userFreeTimeSlots[0]] // Initialize with the freeTimeSlots of the first user
    );

    return commonAvailableDays;
  };

  const commonAvailableDays = calculateCommonAvailableDays();

  return (
    <div className="common-available-days">
      <h2>Common Available Days:</h2>
      <ul>
        {commonAvailableDays.map((dateKey) => (
          <li key={dateKey}>{moment(dateKey).format("dddd, MMMM D, YYYY")}</li>
        ))}
      </ul>
    </div>
  );
}

export default CommonAvailableDays;
