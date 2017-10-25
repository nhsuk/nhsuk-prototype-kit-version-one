;(function () {
  // Utility function to run a callback for all matching elements
  function forEachElement (el, selector, callback) {
    Array.prototype.forEach.call(
      el.querySelectorAll(selector), callback
    )
  }

  // Synchronises the is-selected class on a radio button's label to the
  // checked property of the wrapped radio button. Attach as the onChange
  // handler to the container element for a set of radio buttons
  function radioSelectionManager (ev) {
    forEachElement(ev.currentTarget, 'input[type=radio]',
      function (radio) {
        radio.parentNode.classList[radio.checked ? 'add' : 'remove']('is-selected')
      }
    )
  }

  // Synchronises the is-focused class on a radio button's label to the
  // focus state of the wrapped radio button. Attach as the focusin and
  // focusout handler to the container element for a set of radio buttons.
  // (Note that as the focus and blur events don't bubble, they can't be used
  // in this situation)
  function radioFocusStateManager (ev) {
    forEachElement(ev.currentTarget, 'input[type=radio]',
      function (radio) {
        const hasFocus = document.activeElement === radio
        radio.parentNode.classList[hasFocus ? 'add' : 'remove']('is-focused')
      }
    )
  }

  // Set up all the component handlers when the DOM loads
  document.addEventListener('DOMContentLoaded', function () {
    // Set js-enabled class on html element to indicate that Javascript is
    // enabled to the frontend-library stylesheet
    document.documentElement.classList.add('js-enabled')
    document.documentElement.classList.remove('no-js')

    // Attach radioSelectionManager to all multiple choice containers
    forEachElement(document, '.multiple-choice__container',
      function (container) {
        container.addEventListener('change', radioSelectionManager)
        container.addEventListener('focusin', radioFocusStateManager)
        container.addEventListener('focusout', radioFocusStateManager)
      }
    )
  })
})()
