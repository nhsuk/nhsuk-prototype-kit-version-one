;(function () {
  // Utility function to run a callback for all matching elements
  function forEachElement (el, selector, callback) {
    Array.prototype.forEach.call(
      el.querySelectorAll(selector), callback
    )
  }

  // Synchronises a class on the labels for a set of multiple-choice inputs
  // based on a predicate applied to each input.
  function multipleChoiceInputLabelClassSynchroniser (container, className, predicate) {
    forEachElement(container, 'input[type=radio], input[type=checkbox]',
      function (input) {
        input.parentElement.classList[predicate(input) ? 'add' : 'remove'](className)
      }
    )
  }

  // Synchronises is-selected class on the wrapping labels for a set of
  // multiple-choice inputs to the checked state of each input.
  //
  // Attach as the change event handler to the container element for the
  // set of inputs.
  function multipleChoiceSelectionManager (ev) {
    multipleChoiceInputLabelClassSynchroniser(ev.currentTarget, 'is-selected',
      function (input) { return input.checked }
    )
  }

  // Synchronises the is-focused class on the wrapping labels for a set of
  // multiple-choice inputs to the focus state of each input.
  //
  // Attach as the focusin and focusout handlers to the container element for
  // the set of inputs. (Note that the focus and blur events can't be used in
  // this situation because they don't bubble.)
  function multipleChoiceFocusStateManager (ev) {
    multipleChoiceInputLabelClassSynchroniser(ev.currentTarget, 'is-focused',
      function (input) { return document.activeElement === input }
    )
  }

  // Set up all the component handlers when the DOM loads
  document.addEventListener('DOMContentLoaded', function () {
    // Set js-enabled class on html element to indicate that Javascript is
    // enabled to the frontend-library stylesheet
    document.documentElement.classList.add('js-enabled')
    document.documentElement.classList.remove('no-js')

    // Attach handlers to all multiple choice containers
    forEachElement(document, '.multiple-choice__container',
      function (container) {
        container.addEventListener('change', multipleChoiceSelectionManager)
        container.addEventListener('focusin', multipleChoiceFocusStateManager)
        container.addEventListener('focusout', multipleChoiceFocusStateManager)
      }
    )
  })
})()
