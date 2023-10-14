import React, { useState } from 'react'
import moment from 'moment'
import './App.css'
import Calendar from './components/Calendar'

function App () {
  const [userName, setUserName] = useState('')
  const [users, setUsers] = useState([])
  const [allFreeTimeSlots, setAllFreeTimeSlots] = useState({})
  const [displayedFreeTimeSlots, setDisplayedFreeTimeSlots] = useState({})
  const [suitableCategories, setSuitableCategories] = useState({})
  const [allAvailableTimeSlots, setAllAvailableTimeSlots] = useState({})

  const createUserCalendar = () => {
    if (userName.trim() !== '') {
      const newUser = {
        name: userName,
        currentDate: moment(),
        calendar: {}
      }

      setUsers([...users, newUser])
      setUserName('')
    }
  }

  const displayDuplicateFreeTimeSlots = () => {
    const thisWeekSlots = {}
    const nextWeekSlots = {}

    // Count the number of users available for each slot
    const slotAvailability = {}

    Object.keys(allFreeTimeSlots).forEach((userName) => {
      const userFreeTimeSlots = allFreeTimeSlots[userName]
      Object.keys(userFreeTimeSlots).forEach((slot) => {
        const slotDate = moment(slot)
        const today = moment()
        const endOfThisWeek = today.clone().endOf('week')
        const startOfNextWeek = endOfThisWeek.clone().add(1, 'day')

        if (slotDate.isBefore(endOfThisWeek)) {
          if (!thisWeekSlots[slot]) {
            thisWeekSlots[slot] = []
          }
          thisWeekSlots[slot].push(userName)
        } else if (slotDate.isBefore(startOfNextWeek)) {
          if (!nextWeekSlots[slot]) {
            nextWeekSlots[slot] = []
          }
          nextWeekSlots[slot].push(userName)
        }

        // Count availability for each slot
        if (!slotAvailability[slot]) {
          slotAvailability[slot] = []
        }
        slotAvailability[slot].push(userName)
      })
    })

    const thisWeekMultiUserSlots = {}
    Object.keys(thisWeekSlots).forEach((slot) => {
      if (slotAvailability[slot].length >= 2) {
        thisWeekMultiUserSlots[slot] = thisWeekSlots[slot]
      }
    })

    const nextWeekMultiUserSlots = {}
    Object.keys(nextWeekSlots).forEach((slot) => {
      if (slotAvailability[slot].length >= 2) {
        nextWeekMultiUserSlots[slot] = nextWeekSlots[slot]
      }
    })

    setDisplayedFreeTimeSlots({
      'This Week': thisWeekMultiUserSlots,
      'Next Week': nextWeekMultiUserSlots
    })
  }

  const displayNextWeekFreeTimeSlots = () => {
    const today = moment()
    const startOfNextWeek = today.clone().add(1, 'week').startOf('week')
    const endOfNextWeek = today.clone().add(1, 'week').endOf('week')

    const nextWeekSlots = {}
    const slotAvailability = {}

    Object.keys(allFreeTimeSlots).forEach((userName) => {
      const userFreeTimeSlots = allFreeTimeSlots[userName]
      Object.keys(userFreeTimeSlots).forEach((slot) => {
        const slotDate = moment(slot)

        if (slotDate.isBetween(startOfNextWeek, endOfNextWeek)) {
          if (!nextWeekSlots[slot]) {
            nextWeekSlots[slot] = []
          }
          nextWeekSlots[slot].push(userName)
        }

        if (!slotAvailability[slot]) {
          slotAvailability[slot] = []
        }
        slotAvailability[slot].push(userName)
      })
    })

    const nextWeekMultiUserSlots = {}
    Object.keys(nextWeekSlots).forEach((slot) => {
      if (slotAvailability[slot].length >= 2) {
        nextWeekMultiUserSlots[slot] = nextWeekSlots[slot]
      }
    })

    setDisplayedFreeTimeSlots({
      'This Week': displayedFreeTimeSlots['This Week'],
      'Next Week': nextWeekMultiUserSlots
    })
  }

  const displayAllAvailableTimeSlots = () => {
    const allAvailableSlots = {}

    Object.keys(allFreeTimeSlots).forEach((userName) => {
      const userFreeTimeSlots = allFreeTimeSlots[userName]
      Object.keys(userFreeTimeSlots).forEach((slot) => {
        if (!allAvailableSlots[slot]) {
          allAvailableSlots[slot] = []
        }
        allAvailableSlots[slot].push(userName)
      })
    })

    // Filter slots with availability for at least two users
    const filteredAvailableSlots = {}
    Object.keys(allAvailableSlots).forEach((slot) => {
      if (allAvailableSlots[slot].length >= 2) {
        filteredAvailableSlots[slot] = allAvailableSlots[slot]
      }
    })

    // Set the state to display all available slots for both parties or more
    setAllAvailableTimeSlots(filteredAvailableSlots)
  }

  const categorizeDisplayedDates = () => {
    const today = moment()

    const todayDates = {}
    const tomorrowDates = {}

    Object.keys(displayedFreeTimeSlots).forEach((week) => {
      Object.keys(displayedFreeTimeSlots[week]).forEach((slot) => {
        const slotDate = moment(slot)

        if (slotDate.isSame(today, 'day')) {
          todayDates[slot] = displayedFreeTimeSlots[week][slot]
        } else if (slotDate.isSame(today.clone().add(1, 'day'), 'day')) {
          tomorrowDates[slot] = displayedFreeTimeSlots[week][slot]
        }
      })
    })

    const categorizedDates = {
      Today: todayDates,
      Tomorrow: tomorrowDates
    }

    setSuitableCategories(categorizedDates)
  }

  return (
    <div className="App">
      <div className="header">
        <h1>Meeting Scheduler</h1>
        <div className="user-input">
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={createUserCalendar}>Add User</button>
          <button onClick={displayDuplicateFreeTimeSlots}>
            Display This Week&apos;s Free Time Slots
          </button>
          <button onClick={displayNextWeekFreeTimeSlots}>
            Display Next Week&apos;s Free Time Slots
          </button>
          <button onClick={displayAllAvailableTimeSlots}>
            Display All Available Time Slots
          </button>
          <button onClick={categorizeDisplayedDates}>
            Categorize Today/Tomorrow
          </button>
        </div>
      </div>
      <div className="calendar-container">
        <div className="user-calendars">
          {users.map((user) => (
            <div key={user.name} className="user-calendar">
              <h2>{user.name}&apos;s Calendar</h2>
              <Calendar
                user={user}
                allFreeTimeSlots={allFreeTimeSlots}
                setAllFreeTimeSlots={setAllFreeTimeSlots}
              />
            </div>
          ))}
        </div>
        <div className="suitable-categories">
          {suitableCategories && (
            <>
              <h2>Today / Tomorrow</h2>
              {Object.keys(suitableCategories).map((category) => (
                <div key={category} className="category">
                  <h3>{category}</h3>
                  <ul>
                    {Object.keys(suitableCategories[category]).map((date) => (
                      <li key={date}>
                        <span className="date">Date: {date}</span>
                        <span className="available-for">
                          Available for:
                          {suitableCategories[category][date].join(', ')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>
        {displayedFreeTimeSlots && (
          <div className="displayed-free-time-slots">
            <h2>Displayed Free Time Slots:</h2>
            <ul>
              {Object.keys(displayedFreeTimeSlots).map((week) => (
                <div key={week}>
                  <h3>{week}</h3>
                  <ul>
                    {Object.keys(displayedFreeTimeSlots[week]).map((slot) => (
                      <li key={slot}>
                        Date {slot} - Available for:
                        {displayedFreeTimeSlots[week][slot].join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </ul>
          </div>
        )}
        {allAvailableTimeSlots && (
          <div className="all-available-time-slots">
            <h2>All Available Time Slots:</h2>
            <ul>
              {Object.keys(allAvailableTimeSlots).map((slot) => (
                <li key={slot}>
                  Date {slot} - Available for:
                  {allAvailableTimeSlots[slot].join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
