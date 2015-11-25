import React from 'react';
import classNames from 'classnames';

import css from './typeahead.css';

export default class TypeaheadOption extends React.Component {
  /**
   * Render
   * @return    {React}
   */
  render() {
    var classes = classNames('typeahead--item', css.item, {
      'typeahead--selected': this.props.selected,
      [css.selected]: this.props.selected
    });

    if(this.props.empty) {
      return (
        <li className={classes}>
          {typeof this.props.empty === 'string' ? this.props.empty : 'No Results...'}
        </li>
      );
    }

    return (
      <li
        className={classes}
        onClick={this.props.onClick}
        /* eslint-disable */
        dangerouslySetInnerHTML={{ __html:this.props.option.string }}
        /* eslint-enable *//>
    );
  }
}

TypeaheadOption.defaultProps = {
  empty: false,
  option: {
    original: '',
    string: ''
  }
};
