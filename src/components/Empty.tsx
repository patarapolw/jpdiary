import styled from '@emotion/styled'
import React from 'react'
import tw from 'tailwind.macro'

const Empty = () => {
  const Section = styled.section`
    ${tw`m-2`}
  `

  return (
    <Section className="container">
      <h1 className="title is-4">Sorry, but no post can be found.</h1>
    </Section>
  )
}

export default Empty
