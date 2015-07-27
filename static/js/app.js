var Item = React.createClass({
  getStatusMessage: function(status){
    var message = '';
    switch(Number(status)){
      case 0:
        message = 'Awaiting Approval';
        break;
      case 1:
        message = 'Approved. Awaiiting Purchase'
        break;
      case 2:
        message = 'Closed';
        break;
      case 3:
        message = 'Request Denied'
        break;
      default:
        message = 'Unknown'
        break;
    }
    return <span id='status_message' className='hidden-xs'>{message}</span>
  },
  createName: function(name){
    return <span className="itemName">{name}</span>;
  },
  sanitizeLink: function(link){
    return <a href={link}>Link</a>;
  },
  createDate: function(date){
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    var d = new Date(Date.parse(date));
    return monthNames[d.getMonth()] + " " + d.getDay()
  },
  createDateAndLink: function(date, link){
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    var d = new Date(Date.parse(date));
    return <div id="date">{this.createDate(date)} | <a href={link}>Link</a></div>;
  },
  render: function(){
    return (
      <div className='item'>
        {this.createName(this.props.name)} {this.getStatusMessage(this.props.status)}{this.createDateAndLink(this.props.date, this.props.link)}<br/>
        <div className='reason'>{this.props.reason}</div>
      </div>
    );
  }
});

var ItemList = React.createClass({
  getInitialState: function(){
    return {
      items:[]
    };
  },
  loadItemsFromServer: function(){
    $.ajax({
      url: '/_ah/api/items_api/v1/items',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({items: data.items});
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
    var itemNodes = this.state.items.map(function(item){
      return (
        <Item name={item.name} status={item.status} date={item.date} reason={item.reason} urlsafe={item.urlsafe} link={item.link}/>
      );
    });
    return (
      <div className='items'>
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

    if(!name || !email || !reason){
      return;
    }



    var data_;

    data_ = {
      'name':name,
      'link':url,
      'reason':reason
    };
    console.log(data_);
    $.ajax({
      url: '/_ah/api/items_api/v1/item',
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(data_),
      success: function(data) {
        console.log("Sucess!");
        React.findDOMNode(this.refs.name_).value = '';
        React.findDOMNode(this.refs.email).value = '';
        React.findDOMNode(this.refs.url).value = '';
        React.findDOMNode(this.refs.reason).value = '';
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/_ah/api/items_api/v1/item', status, err.toString());
      }.bind(this)
    });


    return;
  },
  render: function(){
    return (
      <div className = "material-card" id = "input-form">
        <form className='item_form' onSubmit={this.submitForm}>
          <input type='text' ref='name_' placeholder='Item Name' className='input-element' required/><br/>
          <input type='email' ref='email' placeholder='E-Mail' className='input-element' required/><br/>
          <input type='url' ref='url' placeholder='Link to Item' className='input-element'/><br/>
          <textarea row='40' ref='reason' columns='4' placeholder='Reason' className='input-element' required>
          </textarea><br/>
          <input type='submit' placeholder='Request Item'/>
        </form>
      </div>
    );
  }
});

var Placehold = React.createClass({
  render: function(){
    return(<div id='placehold'>

    </div>);


  }
});

var NavBar = React.createClass({
  getInitialState: function(){
    return {
      inputHidden: true
    };
  },
  toggle: function(){
    this.setState({ inputHidden: !this.state.inputHidden });
  },
  render: function(){
    return (
      <div>
      <div className="top_bar">
    		<span id='top_font'>Item Tracker</span>
    		<span id='top_button'><a onClick={this.toggle}><span className="glyphicon glyphicon-plus"></span></a></span>
    	</div>
      {this.state.inputHidden ? <Placehold/> : <NewItemRequest/>}
      </div>
    );
  }
});

var Main = React.createClass({
  render: function() {
    return (
        <div>
          <NavBar/>

            <div id='item-list' className='material-card'>
              <ItemList />
            </div>
        </div>
    );
    }
  });
  React.render(
    <Main />,	document.getElementById('react_content')
);
