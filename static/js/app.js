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
    return <div>{this.createDate(date)} |
        <a href={link}>Link</a>{price}</div>;
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
        <Item cost={item.cost} date={item.date} link={item.link} name={item.name} reason={item.reason} status={item.status} urlsafe={item.urlsafeX}/>
      );
    });
    return (
      <div>
        {this.props.items != 0 ? itemNodes : ''}
      </div>
    );

  }
});

var NewItemRequest = React.createClass({
  submitForm: function(e) {
    e.preventDefault();
    var name = React.findDOMNode(this.refs.name_).value;
    var email = React.findDOMNode(this.refs.email).value;
    var url = React.findDOMNode(this.refs.url).value;
    var reason = React.findDOMNode(this.refs.reason).value;
    var cost = React.findDOMNode(this.refs.cost).value;

    if (!name || !email || !reason) {
      return;
    }
    var data_;

    data_ = {
      'name': name,
      'link': url,
      'reason': reason,
      'requested_by': email,
      'cost': cost
    };
    console.log(data_);
    $.ajax({
      url: '/_ah/api/items_api/v1/item',
      dataType: 'json',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data_),
      success: function(data) {
        this.props.onSuccessAdd(data);
        React.findDOMNode(this.refs.name_).value = '';
        React.findDOMNode(this.refs.email).value = '';
        React.findDOMNode(this.refs.url).value = '';
        React.findDOMNode(this.refs.reason).value = '';
        React.findDOMNode(this.refs.cost).value = '';
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(xhr.responseText);
      }.bind(this)
    });
    return;
  },
  render: function() {
    if (this.props.hidden) {
      return (
        <div></div>
      );
    }
    return (
      <div className="card">
        <div className='card-content'>
          <form onSubmit={this.submitForm}>
            <input className='input-element' placeholder='Item Name' ref='name_'  type='text' required/><br/>
              <input className='input-element' placeholder='E-Mail' ref='email' type='email' required/><br/>
                <input className='input-element' placeholder='Link to Item' ref='url' type='url'/><br/>
                <input className='input-element' placeholder='Cost Estimate' ref='cost' step='0.01' type='number'/><br/>
                <textarea className='input-element' columns='4' placeholder='Reason' ref='reason' required row='40'></textarea><br/>
                <input placeholder='Request Item' type='submit'/>
              </form>
            </div>
          </div>
    );
  }
});

var NavBar = React.createClass({
  render: function() {
    return (
      <nav>
        <div className="nav-wrapper red darken-4">
          <a className="brand-inset hide-on-small-only" href="#">Item Tracker</a>
          <a className="brand-inset hide-on-med-and-up" href="#">Tracker</a>

          <ul className="right" id="nav-mobile">
            <li><a className='' href='https://github.com/TKEzetaMu/ItemTracker/wiki'><i className='material-icons'>info_outline</i></a></li>
            <li><a href={this.props.readyToBuy > 0 ? '/buy' : '#'}><span className='hide-on-small-only'>Buy Items </span><span className='hide-on-med-and-up'>Buy </span><span className={this.props.readyToBuy > 0 ? 'custom-badge' : 'hide'}>{this.props.readyToBuy}</span></a></li>
            <li>
              <a onClick={this.props.onToggle}>
                <i className="material-icons mobile-click">playlist_add</i>
              </a>
            </li>

          </ul>
        </div>
      </nav>
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
      url: '/_ah/api/items_api/v1/items',
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (data.items === undefined) {
          this.setState({
            items: [],
            loaded: true,
            error: false
          });
          this.props.onNew(0)
          return;
        }
        this.setState({
          items: data.items,
          loaded: true,
          error: false
        });
        var count = 0;
        for(i = 0; i < data.items.length; i++){
          if(data.items[i].status == 3){
            count = count + 1;
          }
        }
        this.props.onNew(count)
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
        <div className='col m8 s12 offset-m2 hide-on-large-only'>
          <NewItemRequest hidden={this.props.hidden} onSuccessAdd={this.addItem.bind(this)}/>
        </div>
        <div className='col s12 l8 offset-l2'>
          <ItemList items={this.state.items} loaded={this.state.loaded}/>
        </div>
        <div className='col l2 hide-on-med-and-down'>
          <NewItemRequest hidden={this.props.hidden} onSuccessAdd={this.addItem}/>
        </div>

      </div>

    );
  }
});

var Main = React.createClass({
  getInitialState: function() {
    return {
      inputHidden: true,
      numUnbought: 0
    }
  },
  toggleState: function() {
    this.setState({
      inputHidden: !this.state.inputHidden,
      numUnbought: this.state.numUnbought
    });
  },
  updateUnbought: function(num){
    this.setState({
      inputHidden: this.state.inputHidden,
      numUnbought: num
    });
  },
  render: function() {
    var bindClick = this.toggleState.bind(this);
    return (
      <div>
        <NavBar onToggle={bindClick} readyToBuy={this.state.numUnbought}/>
        <PageContent hidden={this.state.inputHidden} onNew={this.updateUnbought}/>
      </div>
    );
  }
});
React.render(<Main/>, document.getElementById('react_content'));
