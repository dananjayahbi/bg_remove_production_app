import React from 'react'
import HeaderComp from '../components/HeaderComp'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
      <HeaderComp />
      <div style={{ minHeight: 'calc(100vh - 125px)' }}>
        Home
      </div>
      <Footer style={{ position: 'fixed', bottom: 0, width: '100%' }} />
    </>
  )
}

export default Home