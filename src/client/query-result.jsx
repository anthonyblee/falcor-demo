var React = require('react'),
    model = require('./model.js');

var QueryResult = React.createClass({

  render: function() {
    return (
      <div>
        <label>Result</label>
        <pre>
          <div id="result">
            {this.props.data}
          </div>
        </pre>
      </div>
    );
  }
});

module.exports = QueryResult
