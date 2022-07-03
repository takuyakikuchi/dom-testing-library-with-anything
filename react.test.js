import '@testing-library/jest-dom/extend-expect'
import * as React from 'react'
import ReactDOM from 'react-dom'
import userEvent from '@testing-library/user-event'
import { fireEvent, getQueriesForElement } from '@testing-library/dom'

function Counter() {
  const [count, setCount] = React.useState(0)
  const increment = () => setCount(c => c + 1)
  return (
    <div>
      <button onClick={increment}>{count}</button>
    </div>
  )
}

function render(ui) {
  const container = document.createElement('div')
  /**
   * https://reactjs.org/docs/react-dom.html#render
   * Render a React element into the DOM in the supplied container.
   * Return a reference to the component.
   */
  ReactDOM.render(ui, container)

  document.body.appendChild(container)

  /**
   * https://testing-library.com/docs/dom-testing-library/api-within/
   * Takes a DOM element and binds it to the raw query functions.
   */
  return {
    ...getQueriesForElement(container),
    container,
    cleanup() {
      /**
       * https://reactjs.org/docs/react-dom.html#unmountcomponentatnode
       * Remove a mounted React component from the DOM and clean up its event handlers and state.
       */
      ReactDOM.unmountComponentAtNode(container)
      document.body.removeChild(container)
    }
  }
}

test('renders a counter', () => {
  const { getByText, cleanup } = render(<Counter />)
  // https://testing-library.com/docs/dom-testing-library/cheatsheet/#queries
  const counter = getByText('0')
  // https://testing-library.com/docs/dom-testing-library/api-events/#fireevent
  fireEvent.click(counter)
  expect(counter).toHaveTextContent('1')

  fireEvent.click(counter)
  expect(counter).toHaveTextContent('2')

  // To avoid mess up other tests using `render` method.
  cleanup()
})
