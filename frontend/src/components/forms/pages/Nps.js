import React from 'react'

function Nps({title,tags}) {
  return (
    <div className="nps">
        <h3>
          {title}
        </h3>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform">
          <ToggleButton value="bad">
            Not at all
            </ToggleButton>
          <ToggleButton 
          value="average"
          >May be</ToggleButton>
          <ToggleButton value="good">Extremely likely</ToggleButton>
        </ToggleButtonGroup>
      </div>
  )
}

export default Nps