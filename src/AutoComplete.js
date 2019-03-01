import React, { useState, useRef, useEffect } from 'react'
const styles = require("./AutoComplete.module.scss")

function fakeSeachAPI(text) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() * 100 < 30) {
        reject('500')
      } else {
        resolve([
          text,
          `${text}-${text}`,
          `${text}-${text}-${text}`
        ])
      }
    }, 200)
  })
}

function AutoComplete() {
  const [searchText, setSearchText] = useState('')
  const [hints, setHints] = useState([])
  const [hintsVisible, setHintsVisible] = useState(false)

  // https://github.com/facebook/react/issues/14010
  // State from useState hook inside a setTimeout is not updated
  const searchTextRef = useRef(searchText)
  searchTextRef.current = searchText

  const containerEl = useRef(null)

  useEffect(() => {
    document.addEventListener('click', handleGlobalClick)
    return () => {
      document.removeEventListener('click', handleGlobalClick)
    }
  })

  function handleGlobalClick(e) {
    if (!containerEl.current.contains(e.target)) {
      setHintsVisible(false)
    }
  }

  function handleTextChange(e) {
    const text = e.target.value
    setSearchText(text)
    // delay 400ms to start search
    setTimeout(() => {
      // if after 400ms, the current searchText is still text
      // then we start to search
      // else it means current searchText changed
      // this is used to avoid frequent network requests
      if (searchTextRef.current === text) {
        search(text)
      }
    }, 400)
  }

  function search(text) {
    fakeSeachAPI(text)
      .then(hints => {
        // console.log(hints)
        if (text === searchTextRef.current) {
          setHints(hints)
        }
      })
      .catch(err => {
        // console.log(err)
        if (text === searchTextRef.current) {
          setHints([])
        }
      })
  }

  function handleFoucus(e) {
    setHintsVisible(true)
  }

  function handleHintClick(hint) {
    // console.log('click hint')
    setSearchText(hint)
    setHintsVisible(false)
  }

  function renderHint(hint) {
    return (
      <li key={hint}>
        <div onClick={(e) => handleHintClick(hint)}>
          {hint}
        </div>
      </li>
    )
  }

  function renderHints() {
    return (
      <ul className={styles.hints_box}>
        {
          hints.map(renderHint)
        }
      </ul>
    )
  }

  return (
    <div className={styles.container} ref={containerEl}>
      <input value={searchText}
        onChange={handleTextChange}
        onFocus={handleFoucus}
        placeholder='search' />
      {
        hintsVisible && hints.length > 0 && renderHints()
      }
    </div>
  )
}

export default AutoComplete
