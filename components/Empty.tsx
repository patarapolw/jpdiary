import styles from '@/styles/margin.module.scss'

const Empty = () => {
  return (
    <section className={['container', styles['m-0_5']].join(',')}>
      <h1 className="title is-4">Sorry, but no post can be found.</h1>
    </section>
  )
}

export default Empty
