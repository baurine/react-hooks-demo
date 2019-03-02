import React from 'react'
import AutoComplete from './AutoComplete'

function fakeSeachAPI(text) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() * 100 < 30) {
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
