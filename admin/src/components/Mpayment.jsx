import React from 'react'
import TopDetails from './TopDetails'

export default function Mpayment(props) {
  return (
    <section className="manage-payment section">
        <TopDetails title="Manage Payment" navbar={props.navContainerRef} />
    </section>
  )
}
