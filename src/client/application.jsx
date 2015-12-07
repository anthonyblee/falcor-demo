var React = require('react'),
    ReactDom = require('react-dom'),
    QueryForm = require('./query-form.jsx'),
    QueryResult = require('./query-result.jsx'),
    model = require('./model.js');

class QueryManager extends React.Component {

    constructor() {
      super()
      this.handleQuerySubmit = this.handleQuerySubmit.bind(this)
      this.state = { results: 'Enter Query...' }
    }


    handleQuerySubmit(query) {

      // Split the textarea query by newline
      var lines = query.query.replace(/\r\n/g, "\n").split("\n");

      model.get(...lines)
        .then(response => {
          var results = JSON.stringify(response, null, 2)
          this.setState( {results: results} )
        });
    }

    render() {
        return (
            <div className="col-sm-12">
              <h2>Query</h2>

              <div className="col-sm-6">
                <QueryForm onQuerySubmit={this.handleQuerySubmit} />
              </div>
              <div className="col-sm-6">
                <QueryResult data={this.state.results} />
              </div>
            </div>
        )
    }
}

ReactDom.render(<QueryManager/>, document.querySelector('#query'));
