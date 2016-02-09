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
import TextInput from 'react-textinput';
import OutsideClick from 'react-outsideclick';

// Components
import TypeaheadList from './TypeaheadList';

import css from './typeahead.css';

class Typeahead extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hide: true,
      visible: this.getResults.call(this, props.defaultValue, props.options),
      value: props.defaultValue,
      selected: 0
    };

    // Ensure proper context
    const bindFn = ['getResults', 'handleChange', 'handleSelected', 'keyEvent', 'handleKeyDown', '_onEnter', '_onUp', '_onDown'];
    bindFn.forEach((fn)=> this[fn] = this[fn].bind(this));
  }

  /**
   * Update selection if options change
   *
   * @param     {Object}    nextProps
   */
  componentWillReceiveProps(nextProps) {
    let value = this.state.value;
    if (nextProps.defaultValue !== this.props.defaultValue) {
      value = nextProps.defaultValue;
    }

    // Get new results
    var results = this.getResults(value, nextProps.options);

    this.setState({
      visible: results,
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
  getResults(value, options) {
    var results = fuzzy.filter(value || '', options, {
      pre: '<span class=\'typeahead-found\'>',
      post: '</span>',
      extract: this.props.extract
    });

    // If we have an exact match, move it to the top
    let exactIndex = results.findIndex((result) => result.original.value === value);
    if (exactIndex > -1) {
      let exacted = results.splice(exactIndex, 1)[0];
      results.unshift(exacted);
    }

    if (this.props.maxVisible) {
      results = results.slice(0, this.props.maxVisible);
    }

    return results;
  }

  /**
   * Update the search results and parent
   */
  handleChange(event, callback) {
    let state = {
      value: event.target.value,
      selected: 0
    };

    // Get new results
    state.visible = this.getResults(event.target.value, this.props.options);
    state.hide = false;
    if(state.visible.length === 1) {
      state.hide = state.visible[0].original.value === event.target.value;
    }

    this.setState(state, () => {
      if (this.props.onChange){
        this.props.onChange({
          target: {
            value: this.state.value
          }
        });
      }
      if(callback) {
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
    let ev = {
      target: {
        value: option.original.value
      }
    };
    // Check to see if the event was cancelled elsewhere
    const { defaultPrevented } = event;

    this.handleChange(ev, () => {
      if (this.props.onSelected && !defaultPrevented) {
        this.props.onSelected(this.state.value);
      }

      this.setState({
        hide: true
      });
    });

  }

  /**
   * Associate a function handler depending on the keypress
   *
   * @param     {Number}    keyCode
   * @return    {Function}
   */
  keyEvent(keyCode){
    switch(keyCode) {
      case 'Enter':
      case 'Tab':
        return this._onEnter;
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
      this.handleSelected(this.state.visible[this.state.selected], event);
    }
  }

  /**
   * Event to move the selection up the list
   */
  _onUp() {
    var current = this.state.selected;
    this.setState({
      selected: current > 0 ? current - 1 : 0
    });
  }

  /**
   * Event to move the selection down the list
   */
  _onDown() {
    var current = this.state.selected;
    var max = this.state.visible.length - 1;
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
   * Call any associated key events
   *
   * @param     {Event}    event
   */
  handleKeyDown(event) {
    this.stopHiding();
    var handler = this.keyEvent(event.key);
    if (typeof handler === 'function'){
      event.preventDefault();
      handler.call(this, event);
    }
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  }

  handleOutsideClick() {
    this.setState({
      hide: true
    });
  }

  renderEmpty(classes) {
    return (
      <div className={classes}>
        <div className='typeahead--container'>
          <div className='typeahead--input form-input'>
            {this.props.defaultValue}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render
   *
   * @return    {Render}
   */
  render() {
    var classes = classNames(
      'typeahead',
      this.props.className, {
      'typeahead--editable' : this.props.editable
    });

    if (!this.props.editable) {
      return this.renderEmpty(classes);
    }

    return (
      <div className={classes}>
        <OutsideClick className={classNames('typeahead--container', css.container)}
          onClick={this.handleOutsideClick.bind(this)}>
          <TextInput
            className={classNames('typeahead--input', css.input)}
            onChange={this.handleChange.bind(this)}
            onKeyDown={this.handleKeyDown.bind(this)}
            onBlur={this.props.onBlur}
            value={this.state.value}
            validate={this.props.validate}
            defaultValue={this.props.defaultValue}
            minRows={1}
            maxRows={1}
            label={this.props.placeholder} />
          <TypeaheadList
            empty={this.state.hide ? void 0 : this.props.empty}
            selected={this.state.selected}
            value={this.state.value}
            extract={this.props.extract}
            visible={this.state.hide !== true ? this.state.visible : []}
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
  defaultValue: '',
  placeholder: '',
  maxVisible: 5,
  extract: function(item) {
    return item;
  }
}

export default Typeahead;
