import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

function Calendar ({ user, setAllFreeTimeSlots }) {
  const [freeTimeSlots, setFreeTimeSlots] = useState({})

  // useEffect reruns everytime when freeTimeSlots state changes
  useEffect(() => {
    setAllFreeTimeSlots((prevAllFreeTimeSlots) => ({
      ...prevAllFreeTimeSlots,
      [user.name]: freeTimeSlots
    }))
  }, [freeTimeSlots, setAllFreeTimeSlots, user.name])

  const startOfWeek = moment().startOf('week')
  const endOfWeek = moment().endOf('week').add(6, 'weeks')

  const currentDay = startOfWeek.clone()
  const weeks = []
  const thisWeek = moment().week()
  const nextWeek = thisWeek + 1

  const toggleSlot = (dateKey) => {
    setFreeTimeSlots((prevFreeTimeSlots) => {
      const updatedFreeTimeSlots = { ...prevFreeTimeSlots }

      if (updatedFreeTimeSlots[dateKey]) {
        delete updatedFreeTimeSlots[dateKey]
      } else {
        updatedFreeTimeSlots[dateKey] = true
      }

      return updatedFreeTimeSlots
    })
  }

  while (currentDay.isBefore(endOfWeek)) {
    const days = []
    for (let i = 0; i < 7; i++) {
      const dateKey = currentDay.format('YYYY-MM-DD')
      const isFree = freeTimeSlots[dateKey]

      // Check if the date is "Today" (without considering time)
      const isToday = currentDay.isSame(moment(), 'day')
      const weekNumber = currentDay.week()

      const weekClassName =
                weekNumber === thisWeek
                  ? 'this-week'
                  : weekNumber === nextWeek
                    ? 'next-week'
                    : ''
      days.push(
                <div
                    key={i}
                    className={`day ${isFree ? 'free' : ''} ${isToday ? 'today' : ''
                        } ${weekClassName}`}
                >
                    {currentDay.format('dddd D')}
                    <input
                        type="checkbox"
                        checked={isFree}
                        onChange={() => toggleSlot(dateKey)}
                    />
                </div>
      )
      currentDay.add(1, 'day')
    }
    weeks.push(
            <div key={weeks.length} className="week">
                Week {currentDay.format('W')}
                <div className="days">{days}</div>
            </div>
    )
  }

  return (
        <div>
            <h1>{user.currentDate.format('MMMM YYYY')}</h1>
            <div className="weeks">{weeks}</div>
            <div className="selected-slots">
                <h2>Selected Free Time Slots:</h2>
                <ul>
                    {Object.keys(freeTimeSlots).map((dateKey) => (
                        <li key={dateKey}>
                            {moment(dateKey).format('dddd, MMMM D, YYYY')}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
  )
}

Calendar.propTypes = {
  user: PropTypes.shape({
    currentDate: PropTypes.instanceOf(Date).isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  setAllFreeTimeSlots: PropTypes.func.isRequired
}

export default Calendar
