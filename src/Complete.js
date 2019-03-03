import React from 'react'
import AutoComplete from './AutoComplete'

function fakeSeachAPI(text) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (text.length < 2 || text.length > 8) {
        reject('500')
      } else {
        resolve([
          text,
          `${text}${text}`,
          `${text}${text}${text}`
        ])
      }
    }, 200)
  })
}

function Complete() {
  return (
    <AutoComplete
      onSearch={fakeSeachAPI}
      onTextChange={(text) => console.log(text)}
      placeholder='search' />
  )
}

export default Complete
