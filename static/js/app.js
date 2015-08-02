var Item = React.createClass({
  getStatusMessage: function(status){
    var message = '';
    switch(Number(status)){
      case 0:
        message = 'Awaiting Approval';
        break;
      case 1:
        message = 'Pylo Approved'
        break;
      case 2:
        message = 'Cryso Approved';
        break;
      case 3:
        message = 'Approved. Awaiting Purchase';
        break;
      case 4:
        message = 'Denied';
        break;
      case 5:
        message = 'Purchased';
        break;
      default:
        message = 'Unknown'
        break;
    }
    return <span className='right hide-on-small-only'>{message}</span>
  },
  createName: function(name){
    return <span className="card-title activator grey-text text-darken-4">{name}</span>;
  },
  sanitizeLink: function(link){
    return <a href={link}>Link</a>;
  },
  createDate: function(date){
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

    var d = new Date(Date.parse(date));
    return monthNames[d.getMonth()] + " " + d.getDate()
  },
  createDateAndLink: function(date, link, cost){
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    var d = new Date(Date.parse(date));
    var price = (cost != '') ? !(cost === undefined) ? ' | Price: $'+cost : '' : '';
    return <div>{this.createDate(date)} | <a href={link}>Link</a>{price}</div>;
  },
  render: function(){
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
  render: function(){
    return(
      <div className="preloader-wrapper big active">
        <div className="spinner-layer spinner-red-only">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div><div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>
    </div>
    );
  }
});

var ItemList = React.createClass({
  getInitialState: function(){
    return {
      items:[],
      loaded: false
    };
  },
  loadItemsFromServer: function(){
    $.ajax({
      url: '/_ah/api/items_api/v1/items',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({items: data.items, loaded: true});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadItemsFromServer();
  },
  render: function(){
    if(this.state.items===undefined && !this.state.loaded){
      return (
        <div className='card'>
          <div className='card-content center-align'>
            <Loader/>
          </div>
        </div>
      );
    }
    else if(this.state.items.length == 0 && !this.state.loaded){
      return (<div className='card'>
        <div className='card-content center-align'>
          <Loader/>
        </div>
      </div>);
    }
    else if(this.state.items===undefined && this.state.loaded){
      return (<div className='card'>
        <div className='card-content center-align'>
          There are no items to review!
        </div>
      </div>);
    }
    else if(this.state.items.length == 0 && this.state.loaded){
      return (<div className='card'>
        <div className='card-content center-align'>
          There are no items to review!
        </div>
      </div>);
    }

    var itemNodes = this.state.items.map(function(item){
      return (
        <Item name={item.name} status={item.status} date={item.date} reason={item.reason} urlsafe={item.urlsafeX} link={item.link} cost={item.cost}/>
      );
    });
    return (
      <div>
        {this.state.items != 0 ? itemNodes : ''}
      </div>
    );

  }
});

var NewItemRequest = React.createClass({
  submitForm: function(e){
    e.preventDefault();
    var name = React.findDOMNode(this.refs.name_).value;
    var email = React.findDOMNode(this.refs.email).value;
    var url = React.findDOMNode(this.refs.url).value;
    var reason = React.findDOMNode(this.refs.reason).value;
    var cost = React.findDOMNode(this.refs.cost).value;

    if(!name || !email || !reason){
      return;
    }
    var data_;

    data_ = {
      'name':name,
      'link':url,
      'reason':reason,
      'requested_by':email,
      'cost':cost
    };
    console.log(data_);
    $.ajax({
      url: '/_ah/api/items_api/v1/item',
      dataType: 'json',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data_),
      success: function(data) {
        console.log("Sucess!");
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
  render: function(){
    if(this.props.hidden){
      return(<div></div>);
    }
    return (
      <div className = "card">
        <div className='card-content'>
          <form onSubmit={this.submitForm}>
            <input type='text' ref='name_' placeholder='Item Name' className='input-element' required/><br/>
            <input type='email' ref='email' placeholder='E-Mail' className='input-element' required/><br/>
            <input type='url' ref='url' placeholder='Link to Item' className='input-element'/><br/>
            <input type='number' ref='cost' placeholder='Cost Estimate' className='input-element' step='0.01'/><br/>
            <textarea row='40' ref='reason' columns='4' placeholder='Reason' className='input-element' required>
            </textarea><br/>
            <input type='submit' placeholder='Request Item'/>
          </form>
        </div>
      </div>
    );
  }
});

var NavBar = React.createClass({
  render: function(){
    return (
      <nav>
        <div className="nav-wrapper red darken-4">
          <a href="#" className="brand-inset">Item Tracker</a>
          <ul id="nav-mobile" className="right">
            <li><a onClick={this.props.onToggle}><i className="material-icons mobile-click">playlist_add</i></a></li>
          </ul>
        </div>
      </nav>
    );
  }
});

var PageContent = React.createClass({

  render: function(){
    return(

        <div className='row'>

          <div className='col m8 s12 offset-m2 hide-on-large-only'>
            <NewItemRequest hidden={this.props.hidden}/>
          </div>
          <div className='col s12 l8 offset-l2'>
            <ItemList/>
          </div>
          <div className='col l2 hide-on-med-and-down'>
            <NewItemRequest hidden={this.props.hidden}/>
          </div>

        </div>

    );
  }
});

var Main = React.createClass({
  getInitialState: function(){
    return{
      inputHidden: true
    }
  },
  toggleState: function(){
    this.setState({ inputHidden: !this.state.inputHidden });
  },
  render: function() {
    var bindClick = this.toggleState.bind(this);
    return (
        <div>
          <NavBar  onToggle={bindClick}/>
          <PageContent hidden={this.state.inputHidden}/>
        </div>
    );
    }
  });
  React.render(
    <Main />,	document.getElementById('react_content')
);
