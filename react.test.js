// To add handy assertions to Jest
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import ReactDOM from 'react-dom'
// TO test anything that renders to the DOM
import {getQueriesForElement, fireEvent} from '@testing-library/dom'

function Counter() {
  const [count, setCount] = React.useState(0)
  const increment = () => setCount(count => count + 1)

  return (
    <div>
      <button onClick={increment}>{count}</button>
    </div>
  )
}

function render(ui) {
  const container = document.createElement('div')
  /**
   * @see https://ja.reactjs.org/docs/react-dom.html#render
   * 渡された container の DOM に React 要素をレンダーし、コンポーネントへの参照を返します。
   */
  ReactDOM.render(ui, container)
  document.body.appendChild(container)
  return {
    ...getQueriesForElement(container),
    container,
    cleanup() {
      ReactDOM.unmountComponentAtNode(container)
      document.body.removeChild(container)
    },
  }
}

test('renders a container', () => {
  const {getByText, cleanup} = render(<Counter />)
  const counter = getByText('0')
  fireEvent.click(counter)
  expect(counter).toHaveTextContent('1')

  fireEvent.click(counter)
  expect(counter).toHaveTextContent('2')
  cleanup()
})
