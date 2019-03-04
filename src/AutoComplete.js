import React, { useState, useRef, useEffect } from 'react'
const styles = require("./AutoComplete.module.scss")

function AutoComplete(props) {
  const [searchText, setSearchText] = useState('')
  const [hints, setHints] = useState([])
  const [hintsVisible, setHintsVisible] = useState(false)

  // https://github.com/facebook/react/issues/14010
  // State from useState hook inside a setTimeout is not updated
  const searchTextRef = useRef(searchText)
  searchTextRef.current = searchText

  const containerEl = useRef(null)

  // `let timeoutId = null` doesn't work
  let timeoutIdRef = useRef(null)

  useEffect(() => {
    document.addEventListener('click', handleGlobalClick)
    return () => {
      document.removeEventListener('click', handleGlobalClick)
    }
  })

  function handleGlobalClick(e) {
    // click outside the container
    if (!containerEl.current.contains(e.target)) {
      setHintsVisible(false)
    }
  }

  function handleTextChange(e) {
    const text = e.target.value
    changeSearchText(text)
    // // delay 400ms to start searching
    // setTimeout(() => {
    //   // after 400ms, if the current searchText is still same as text
    //   // then we start to search really
    //   // else it means current searchText changed
    //   // this is used to avoid useless network requests
    //   if (searchTextRef.current === text) {
    //     search(text)
    //   }
    // }, 400)

    clearTimeout(timeoutIdRef.current)
    // timeoutIdRef.current = setTimeout(() => { search(text) }, 400)
    timeoutIdRef.current = setTimeout(search, 400, text)
  }

  function search(text) {
    // console.log('start search:', text)
    props.onSearch(text)
      .then(hints => {
        // double check whether the current searchText is still same as the search text
        // to avoid override the hints by the wrong result
        if (text === searchTextRef.current) {
          setHints(hints)
        }
      })
      .catch(err => {
        if (text === searchTextRef.current) {
          setHints([])
        }
      })
  }

  function handleFoucus(e) {
    setHintsVisible(true)
  }

  function handleHintClick(hint) {
    changeSearchText(hint)
    setHintsVisible(false)
  }

  function changeSearchText(text) {
    setSearchText(text)
    props.onTextChange(text)
  }

  ///////////////////////////////////

  function renderHints() {
    return (
      <ul className={styles.hints_box}>
        {
          hints.map(renderHint)
        }
      </ul>
    )
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

  return (
    <div className={styles.container} ref={containerEl}>
      <input value={searchText}
        onChange={handleTextChange}
        onFocus={handleFoucus}
        placeholder={props.placeholder} />
      {
        hintsVisible && hints.length > 0 && renderHints()
      }
    </div>
  )
}

export default AutoComplete
