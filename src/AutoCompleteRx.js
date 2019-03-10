import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Subject, from, of, fromEvent } from 'rxjs'
import { tap, debounceTime, switchMap, filter } from 'rxjs/operators'
const styles = require("./AutoComplete.module.scss")

function AutoComplete(props) {
  const [searchText, setSearchText] = useState('')
  const [hints, setHints] = useState([])
  const [hintsVisible, setHintsVisible] = useState(false)
  const [warning, setWarning] = useState('')

  const containerEl = useRef(null)

  const subjectRef = useRef(new Subject())
  useMemo(() => {
    subjectRef.current.pipe(
      tap(changeSearchText),
      debounceTime(500),
      tap(val => console.log('debounce:', val)),
      filter(val => val.length > 1),
      // switchMap(val => from(props.onSearch(val))),
      // tap(data => console.log(data)),
      // tap(data => setHints(data))
      switchMap(val => {
        if (val.length > 7) {
          return of(val).pipe(
            tap(() => setWarning('input too long'))
          )
        } else {
          return from(props.onSearch(val)).pipe(
            tap(data => {
              setWarning('')
              setHints(data)
            })
          )
        }
      })
    ).subscribe()
  }, [subjectRef])

  useEffect(() => {
    // document.addEventListener('click', handleGlobalClick)
    const subscription = fromEvent(document, 'click').pipe(
      filter(e => !containerEl.current.contains(e.target)),
    ).subscribe((val) => setHintsVisible(false))
    return () => {
      // document.removeEventListener('click', handleGlobalClick)
      subscription.unsubscribe()
    }
  })

  // function handleGlobalClick(e) {
  //   // click outside the container
  //   if (!containerEl.current.contains(e.target)) {
  //     setHintsVisible(false)
  //   }
  // }

  function handleTextChange(e) {
    const text = e.target.value
    subjectRef.current.next(text)
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
          warning.length > 0 ?
          <p>{warning}</p> :
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
