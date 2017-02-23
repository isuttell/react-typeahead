/** ****************************************************************************
 * Typeahead List
 *
 * @author       Isaac Suttell <isaac_suttell@playstation.sony.com>
 * @file         Shows a list of options when a user types
 ******************************************************************************/

// Modules
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

// Components
import TypeaheadOption from './TypeaheadOption';

import css from './typeahead.css';

export default class TypeaheadList extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      fixedDropdownStyle: {
        top: 'inherit',
        width: 'inherit',
        left: 'inherit',
        position: 'fixed'
      }
    }
  }

  /**
   * Try to keep the selected comp in view
   */
  componentDidUpdate(prevProps) {
    // when showing drop down, update the positioning styles
    if (this.props.scrollingParentClass && prevProps.visible.length === 0 && this.props.visible.length > 0) {
      // component must be visible use the DOM
      if (!this.scrollParent) {
        this.registerScrollParent(this.props.scrollingParentClass)
      }
      this.setState(this.getDropdownStyle());
    }
  }

  componentWillUnmount() {
    if (this.scrollParent) {
      this.scrollParent.removeEventListener('scroll', this.props.onScrollingParentScroll);
    }
  }

  /**
   * Store a reference to Typeahead's scrolling ancestor node
   * @param  {string} parentClass  the unique className of the scrolling ancestor node
   */
  registerScrollParent(parentClass) {
    let list = ReactDOM.findDOMNode(this.refs.list);
    if (!list) {
      return;
    }
    let ancestor = list.parentNode;
    while (ancestor && ancestor !== document) {
      if (ancestor.classList.contains(parentClass)) {
        ancestor.addEventListener('scroll', this.props.onScrollingParentScroll);
        this.scrollParent = ancestor;
        return;
      }
      ancestor = ancestor.parentNode;
    }
  }

  /**
   * Calculate where to place the dropdown when dropdown must have position:fixed
   */
  getDropdownStyle() {
    if (!this.scrollParent) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("<Typeahead /> must have scrollParent to use getDropdownStyle()")
      }
      return;
    }
    let parent = ReactDOM.findDOMNode(this.refs.list).parentNode;
    let source = parent;
    let offsetTop = 0;
    let scrollParentTop = this.scrollParent.scrollTop;
    while (source) {
      offsetTop += source.offsetTop;
      source = source.offsetParent;
    }

    return {
      fixedDropdownStyle: {
        width: `${parent.offsetWidth}px`,
        position: 'fixed',
        left: 'inherit',
        top: `${(offsetTop - scrollParentTop) + parent.offsetHeight}px`
      }
    };
  }

  /**
   * Render list by order of score
   */
  render() {
    if (!this.props.value || this.props.visible instanceof Array !== true){
      // Nothing to filter by yet
      return null;
    } else if (this.props.visible.length === 0 && this.props.empty !== false) {
      // Can't find anything
      return (
        <ul 
          className={classNames('typeahead--list', css.list)}
        >
          <TypeaheadOption empty={this.props.empty} />
        </ul>
      );
    }

    let listStyle = this.props.scrollingParentClass && this.props.visible.length > 0 ? this.state.fixedDropdownStyle : {};

    return (
        <ul
          ref="list"
          style={listStyle}
          className={classNames('typeahead--list', css.list)}
        >
          {this.props.visible
            .filter((item) => item && item.score && item.original)
            .sort((a, b) => b.score - a.score)
            .map((option, index) => {
              var key = this.props.extract(option.original);
              return (
                <TypeaheadOption
                  key={key}
                  selected={this.props.selected === index}
                  option={option}
                  onClick={this.props.onSelected.bind(null, option)} />
                );
            })}
        </ul>
      );
  }
}

// Type checking
const {number, string, array, bool, func} = React.PropTypes;
TypeaheadList.propTypes = {
  selected:     number,
  value:        string,
  visible:      array,
  empty:        bool,
  extract:      func,
  onSelected:   func
}

/**
 * Defaults
 * @static
 * @type {Object}
 */
TypeaheadList.defaultProps = {
  empty: false,
  visible: [],
  onSelected: function(){}
};
