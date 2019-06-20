import React, { useState, useEffect, useRef } from 'react'

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export default function PreviousValue() {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)
  return (
    <h1>
      Now: {count}, Previous: {prevCount}
      <button onClick={() => setCount(count + 1)}>Plus</button>
    </h1>
  )
}
