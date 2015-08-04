var NavBar = React.createClass({
  render: function() {
    return (
      <nav>
        <div className="nav-wrapper red darken-4">
          <a className="brand-inset hide-on-small-only" href="/buy">Item Tracker - Buy</a>
          <a className="brand-inset hide-on-med-and-up" href="/buy">Buy</a>
          <ul className="right" id="nav-mobile">

          </ul>
        </div>
      </nav>
    );
  }
});

var Item = React.createClass({
  getStatusMessage: function(status) {
    var message = '';
    switch (Number(status)) {
    case 0 :
      message = 'Awaiting Approval';
      break;
    case 1 :
      message = 'Pylo Approved'
      break;
    case 2 :
      message = 'Cryso Approved';
      break;
    case 3 :
      message = 'Approved. Awaiting Purchase';
      break;
    case 4 :
      message = 'Denied';
      break;
    case 5 :
      message = 'Purchased';
      break;
    default :
      message = 'Unknown'
      break;
    }
    return <span className='right hide-on-small-only'>{message}</span>
  },
  createName: function(name) {
    return <span className="card-title activator grey-text text-darken-4">{name}</span>;
  },
  sanitizeLink: function(link) {
    return <a href={link}>Link</a>;
  },
  createDate: function(date) {
    var monthNames = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    var d = new Date(Date.parse(date));
    return monthNames[d.getMonth()] + " " + d.getDate()
  },
  createDateAndLink: function(date, link, cost) {
    var monthNames = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    var d = new Date(Date.parse(date));
    var price = (cost != '')
      ? !(cost === undefined)
        ? ' | Price: $' + cost
        : ''
        : '';
    return <div>{this.createDate(date)} | <a href={link}>Link</a>{price}</div>;
  },
  buyItem: function(){
    data_ = {
      'identifier':this.props.urlsafe,
      'status':5
    };
    console.log(data_);
    $.ajax({
      url: '/_ah/api/items_api/v1/item/change',
      dataType: 'json',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(data_),
      success: function(data) {
        console.log("Sucess!");
        Materialize.toast('Bought!', 4000) // 4000 is the duration of the toast
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/_ah/api/items_api/v1/item', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className='card'>
        <div className='card-content'>
          {this.createName(this.props.name)}{this.getStatusMessage(this.props.status)}
          <p className='hide-on-small-only'>
            {this.props.reason}
          </p>
          <br/>
          <hr/>
          {this.createDateAndLink(this.props.date, this.props.link, this.props.cost)}
          <br/>
          <a className="waves-effect waves-light btn space-right mobile-click" onClick={this.buyItem}>Buy</a>
        </div>
      </div>
    );
  }
});

var Loader = React.createClass({
  render: function() {
    return (
      <div className="preloader-wrapper big active">
        <div className="spinner-layer spinner-red-only">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div>
    );
  }
});

var ItemList = React.createClass({
  render: function() {
    if (this.props.items.length == 0 && !this.props.loaded) {
      return (
        <div className='card'>
          <div className='card-content center-align'>
            <Loader/>
          </div>
        </div>
      );
    } else if (this.props.items.length == 0 && this.props.loaded) {
      return (
        <div className='card'>
          <div className='card-content center-align'>
            There are no items to review!
          </div>
        </div>
      );
    }
    var itemNodes = this.props.items.map(function(item) {
      return (
        <Item cost={item.cost} date={item.date} link={item.link} name={item.name} reason={item.reason} status={item.status} urlsafe={item.urlsafe}/>
      );
    });
    return (
      <div>
        {this.props.items != 0 ? itemNodes : ''}
      </div>
    );

  }
});

var PageContent = React.createClass({
  getInitialState: function() {
    return {
      items : [],
      loaded : false,
      error: false //Notify User of An Error But Abstract it Away from Them
    };
  },
  addItem: function(item) {
    var items = this.state.items;
    var newItems = items.concat([item]);
    this.setState({items: newItems, loaded: true, error: false});
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function() {
    $.ajax({
      url: '/_ah/api/items_api/v1/items?status=3',
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (data.items === undefined) {
          this.setState({
            items: [],
            loaded: true,
            error: false
          });
          return;
        }
        this.setState({
          items: data.items,
          loaded: true,
          error: false
        });
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({
          items: [],
          loaded: true,
          error: true
        });
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {

    return (
      <div className='row'>
        <div className='col s12 l8 offset-l2'>
          <ItemList items={this.state.items} loaded={this.state.loaded}/>
        </div>
      </div>

    );
  }
});

var Main = React.createClass({
  render: function() {
    return (
      <div>
        <NavBar/>
        <PageContent/>
      </div>
    );
  }
});
React.render(<Main/>, document.getElementById('react_content'));
