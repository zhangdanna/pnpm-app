import { Button } from '@my-org/ui'
import { formatDate } from '@my-org/utils'

function App() {
  return (
    <div>
      <h1>Monorepo Demo - {formatDate(new Date())}</h1>
      <Button label="购买" price={99.9} onClick={() => alert('点击了')} />
    </div>
  )
}

export default App