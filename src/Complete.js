import React from 'react'
import AutoComplete from './AutoCompleteRx'

function fakeSeachAPI(text) {
  return new Promise((resolve, reject) => {
    console.log('start search')
    setTimeout(() => {
      console.log('get search response')
      resolve([
        text,
        `${text}${text}`,
        `${text}${text}${text}`
      ])
    }, 1000)
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
