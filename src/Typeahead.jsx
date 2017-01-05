/** ****************************************************************************
 * Typeahead
 *
 * @author       Isaac Suttell <isaac_suttell@playstation.sony.com>
 * @file         As the user types, show a list of options
 ******************************************************************************/

// Modules
import React from 'react';
import classNames from 'classnames';
import fuzzy from 'fuzzy';
import TextInput from 'ship-components-textinput';
import OutsideClick from 'ship-components-outsideclick';

// Components
import TypeaheadList from './TypeaheadList';

import css from './typeahead.css';

class Typeahead extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hide: true,
      visible: this.getResults.call(this, props.value, props.options),
      currentValue: props.value,
      selected: 0
    };

    // Ensure proper context
    const bindFn = [
      'getResults',
      'handleChange',
      'handleSelected',
      'keyEvent',
      'handleKeyDown',
      '_onEnter',
      '_onUp',
      '_onDown',
      'handleValidate',
      'handleOutsideClick'
    ];
    bindFn.forEach(fn => this[fn] = this[fn].bind(this));
  }

  /**
   * Update selection if options change
   *
   * @param     {Object}    nextProps
   */
  componentWillReceiveProps(nextProps) {
    let {currentValue} = this.state;
    if (nextProps.value !== this.props.value) {
      currentValue = nextProps.value;
    }

    // Get new results
    const visible = this.getResults(currentValue, nextProps.options);

    this.setState({
      currentValue,
      visible,
      selected: 0
    });
  }

  /**
   * Search get fuzzy search results
   *
   * @param     {String}           value
   * @param     {Array<string>}    options
   * @return    {Array<object>}
   */
  getResults(currentValue, options) {
    if (typeof currentValue === 'undefined') {
      currentValue = '';
    }

    let results = fuzzy.filter(currentValue.toString() || '', options, {
      pre: '<span class=\'' + this.props.matchedClass + '\'>',
      post: '</span>',
      extract: this.props.extract
    });

    // If we have an exact match, move it to the top
    let exactIndex = results.findIndex(result => result.original.value === currentValue);
    if (exactIndex > -1) {
      let exacted = results.splice(exactIndex, 1)[0];
      results.unshift(exacted);
    }

    if (this.props.maxVisible && this.props.maxVisible > 0) {
      results = results.slice(0, this.props.maxVisible);
    }

    return results;
  }

  /**
   * Update the search results and parent
   */
  handleChange(event, callback) {
    let state = {
      currentValue: event.target.value,
      selected: 0
    };

    // Get new results
    state.visible = state.currentValue.length > 0 ? this.getResults(state.currentValue, this.props.options) : [];

    state.hide = false;
    if (state.visible.length === 1) {
      state.hide = state.visible[0].original.value === event.target.value;
    }

    this.setState(state, () => {
      if (typeof this.props.onChange === 'function'){
        this.props.onChange({
          target: {
            value: this.state.currentValue
          }
        });
      }
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

 /**
   * Handle list item clicks
   *
   * @param     {Object}    option
   */
  handleSelected(option, event) {
    event.stopPropagation();
    if (typeof option !== 'object') {
      throw new TypeError('Option is not an object');
    }
    if (this.state.currentValue.length === '' || this.state.visible.length === 0) {
      return;
    }

    const ev = {
      target: {
        value: option.original.value
      }
    };

    this.handleChange(ev, () => {
      if (typeof this.props.onSelected === 'function') {
        this.props.onSelected(option, event);
      }

      let state = {
        hide: true
      };

      if (this.props.clearOnSelect) {
        state.currentValue = '';
        state.selected = 0;
        state.visible = [];
      }
      this.setState(state);
    });

  }

  /**
   * Associate a function handler depending on the keypress
   *
   * @param     {string}    keyName
   * @return    {Function}
   */
  keyEvent(keyName){
    switch(keyName) {
      case 'Enter':
      case 'Tab':
        // if menu is hidden, do normal tab behavior
        return this.state.hide ? void 0 : this._onEnter;
      case 'ArrowDown':
      case 'Down':
        return this._onDown;
      case 'ArrowUp':
      case 'Up':
        return this._onUp;
      default:
        return void 9;
    }
  }

  /**
   * Activate the currently selected item
   */
  _onEnter(event) {
    if (this.state.visible[this.state.selected]) {
      this.handleSelected(this.getSelected(), event);
    }
  }

  /**
   * Return the active selection
   */
  getSelected() {
    return this.state.visible[this.state.selected];
  }

  /**
   * Event to move the selection up the list
   */
  _onUp() {
    const current = this.state.selected;
    this.setState({
      selected: current > 0 ? current - 1 : 0
    });
  }

  /**
   * Event to move the selection down the list
   */
  _onDown() {
    const current = this.state.selected;
    const max = this.state.visible.length - 1;
    this.setState({
      selected: current < max ? current + 1 : max
    });
  }

  stopHiding() {
    if (this.state.hide === true) {
      this.setState({
        hide: false
      });
    }
  }

  /**
   * Function to help ignore special key strokes
   * @param  {String}  keyName
   * @return {Boolean}
   */
  isSpecialKey(keyName) {
    switch(keyName) {
      case 'Alt':
      case 'CapsLock':
      case 'Control':
      case 'Fn':
      case 'Meta':
      case 'Shift':
      case 'Tab':
        return true;

      default:
        return false;
    }
  }

  /**
   * Call any associated key events
   *
   * @param     {Event}    event
   */
  handleKeyDown(event) {
    if (this.isSpecialKey(event.key)) {
      this.stopHiding();  
    }
    
    let handler = this.keyEvent(event.key);
    if (typeof handler === 'function'){
      event.preventDefault();
      handler.call(this, event);
    }

    if (typeof this.props.onKeyDown === 'function') {
      this.props.onKeyDown(event);
    }
  }

  handleOutsideClick() {
    this.setState({
      hide: true
    });
  }

  handleBlur() {
    if (typeof this.props.onBlur === "function") {
      this.props.onBlur.call();
    }

    this.setState({
      hide: true
    });
  }

  renderEmpty(classes) {
    return (
      <div className={classes}>
        <div className='typeahead--container'>
          <div className='typeahead--input form-input'>
            {this.state.currentValue}
          </div>
        </div>
      </div>
    );
  }

  handleValidate(value) {
    if (typeof this.props.validate === 'function') {
      return this.props.validate(value, this.getSelected());
    }
    return true;
  }

  /**
   * Render
   *
   * @return    {Render}
   */
  render() {
    let classes = classNames(
      'typeahead',
      this.props.className, {
        [css.editable] : this.props.editable,
        'typeahead--editable' : this.props.editable
      }
    );

    if (!this.props.editable) {
      return this.renderEmpty(classes);
    }

    return (
      <div className={classes}>
        <OutsideClick
          className={classNames('typeahead--container', css.container)}
          onClick={this.handleOutsideClick.bind(this)}
        >
          <div>
            <TextInput
              className={classNames('typeahead--input', css.input)}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              onBlur={this.handleBlur.bind(this)}
              onFocus={this.props.onFocus}
              value={this.state.currentValue}
              validate={this.handleValidate}
              editable
              minRows={1}
              maxRows={1}
              label={this.props.placeholder}
            />
            {this.props.isLoading ?
              <span className={classNames('icon-refresh', css.loading)}/>
            : null}
          </div>
          <TypeaheadList
            empty={this.state.hide || this.props.isLoading ? void 0 : this.props.empty}
            selected={this.state.selected}
            value={this.state.currentValue}
            extract={this.props.extract}
            visible={this.state.hide ? [] : this.state.visible}
            onSelected={this.handleSelected} />
        </OutsideClick>
      </div>
    );
  }
}

Typeahead.defaultProps = {
  isLoading: false,
  editable: true,
  empty: false,
  options: [],
  label: '',
  value: '',
  placeholder: '',
  maxVisible: 5,
  clearOnSelect: false,
  matchedClass: 'typeahead-found',
  extract: function(item) {
    return item;
  }
}

export default Typeahead;
