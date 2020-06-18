import Link from 'next/link'
import { useRouter } from 'next/router'
import qs from 'query-string'

const Pagination = ({ current: page, total, q }: {
  current: number
  total: number
  q: string
}) => {
  const { pathname } = useRouter()

  const setPageUrl = (p: number) => {
    const path0 = pathname.replace(/\/(\d+)?$/, '')
    return `${path0 || '/blog'}${p === 1 ? '' : `/${p}`}?${qs.stringify({
      q
    })}`
  }

  return (
    <nav
      className="pagination is-rounded tw-my-4 tw-mx-2"
      role="navigation"
      aria-label="pagination">
      {page > 1 ? (
        <Link href={setPageUrl(page - 1)}>
          <a className="pagination-previous">
            <span className="icon">
              <i className="fa fa-caret-left">Previous</i>
            </span>
          </a>
        </Link>
      ) : null}

      {page < total - 1 ? (
        <Link href={setPageUrl(page - 1)}>
          <a className="pagination-next">
            <span className="icon">
              <i className="fa fa-caret-right">Next</i>
            </span>
          </a>
        </Link>
      ) : null}

      <ul className="pagination-list">
        {page > 1 ? (
          <li>
            <Link href={setPageUrl(1)}>
              <a className="pagination-link" aria-label="go to page 1">
              1
              </a>
            </Link>
          </li>
        ) : null}

        {page > 3 ? (
          <li><span className="pagination-ellipsis">&hellip;</span></li>
        ) : null}

        {page > 2 ? (
          <li>
            <Link href={setPageUrl(page - 1)}>
              <a className="pagination-link" aria-label={`go to page ${page - 1}`}>
                {page - 1}
              </a>
            </Link>
          </li>
        ) : null}

        <li>
          <Link href={setPageUrl(page)}>
            <a className="pagination-link is-current" aria-label={`page ${page}`} aria-current="page">
              {page}
            </a>
          </Link>
        </li>

        {page < total - 1 ? (
          <li>
            <Link href={setPageUrl(page + 1)}>
              <a className="pagination-link" aria-label={`go to page ${page + 1}`}>
                {page + 1}
              </a>
            </Link>
          </li>
        ) : null}

        {page < total - 2 ? (
          <li><span className="pagination-ellipsis">&hellip;</span></li>
        ) : null}

        {page < total ? (
          <li>
            <Link href={setPageUrl(total)}>
              <a className="pagination-link" aria-label={`go to page ${total}`}>
                {total}
              </a>
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  )
}

export default Pagination
