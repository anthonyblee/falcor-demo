var React = require('react'),
    model = require('./model.js');

var QueryForm = React.createClass({

  getInitialState: function() {
    return { query: '' };
  },

  handleQueryChange: function(e) {
    this.setState({ query: e.target.value });
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="query">Query</label>
          <textarea
            id="query-text"
            className="form-control"
            name="query"
            rows="10"
            placeholder="Enter Query"
            onChange={this.handleQueryChange}></textarea>

          <div className="pull-right">
            <button id="query-btn" className="btn btn-primary" type="submit">
              Query
            </button>
          </div>
        </div>
      </form>
    );
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var query = this.state.query.trim();

    if (!query) {
      return;
    }

    this.props.onQuerySubmit({ query: query });
  }
});

module.exports = QueryForm
