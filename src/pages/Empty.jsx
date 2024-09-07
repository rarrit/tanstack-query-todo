import { Link } from "react-router-dom"

const Empty = () => {
  return (
    <div>
      EMPTY

      <Link to={'/'}>
        <button type='button'>메인 페이지로 이동</button>
      </Link>

    </div>
  )
}

export default Empty
