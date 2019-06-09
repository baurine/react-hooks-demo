import React, { useState, useEffect } from "react"

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    console.log('use window width effect')
    const handleSize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleSize)
    return () => {
      window.removeEventListener("resize", handleSize)
    }
  }, [])

  return width
}

export default function WindowWidth() {
  const width = useWindowWidth()
  return <div>window width: {width}</div>
}
