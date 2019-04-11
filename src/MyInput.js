import React, { useState, useEffect } from 'react'

// https://stackoverflow.com/questions/55565444/how-to-register-event-with-useeffect-hooks
export default function MyInput() {
  const [userText, setUserText] = useState('')

  useEffect(() => {
    console.log('useEffect')

    function handlekeydownEvent(event) {
      const { key, keyCode } = event;
      if (keyCode === 32 || (keyCode >= 65 && keyCode <= 90)) {
        setUserText(prevUserText => `${prevUserText}${key}`)
      }
    }

    document.addEventListener('keyup', handlekeydownEvent)
    return () => {
      document.removeEventListener('keyup', handlekeydownEvent)
    }
  }, [])

  return (
    <div>
      <h1>Feel free to type!</h1>
      <blockquote>{userText}</blockquote>
    </div>
  )
}
