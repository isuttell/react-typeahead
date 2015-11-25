/**
 * ES6 Buttons Example
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Typeahead from '../src/Typeahead';

class Examples extends React.Component {

  getOptions() {
    return [
      {
        label: 'One'
      },
      {
        label: 'Two'
      },
      {
        label: 'Three'
      }
    ]
  }

  render() {
    return (
      <div>
        <h1>{'<Typeahead> Examples'}</h1>
        <div className='example-group'>
          <h2>Basic</h2>
          <Typeahead
            options={this.getOptions()}
            extract={(item)=>item.label} />
          <code>
{
`<Typeahead
  options={[
    {
      label: 'One'
    },
    {
      label: 'Two'
    },
    {
      label: 'Three'
    }
  ]}
  extract={(item)=>item.label}
  onChange={this.handleChange} />
`
}
          </code>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Examples />, document.getElementById('examples'));
