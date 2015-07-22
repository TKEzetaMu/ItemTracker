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
        {itemNodes}
      </div>
    );

  }
});

var CommentBox = React.createClass({
  render: function() {
    return (
        <div className="commentBox">
          <Item name='Bleach' status='Awating Approval' date='Some Radnom Time' reason='Do I need one?'/>
        </div>
    );
    }
  });
  React.render(
    <ItemList />,	document.getElementById('content')
);
