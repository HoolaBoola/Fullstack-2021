import React from 'react'

const Total = ({ parts }) => {
  const total = parts.reduce( (a, b) => a + b.exercises, 0);
  return (
    <p>
        <b> Total of {total} exercises 
        </b>
    </p>
  )
}

export default Total
