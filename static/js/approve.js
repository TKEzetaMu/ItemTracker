var NavBar = React.createClass({
  render: function(){
    return (
      <nav>
        <div className="nav-wrapper red darken-4">
          <a href="/" className="brand-inset">Item Approval</a>
          <ul id="nav-mobile" className="right">
            <li><a href='#'><i className="material-icons">playlist_add</i></a></li>
          </ul>
        </div>
      </nav>
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

var Item = React.createClass({
  loadFromServer: function(){
    $.ajax({
      url: '_ah/api/items_api/v1/item',
      dataType: 'json',
      type: 'get',
      data: 'identifier='+this.state.id,
      cache: false,
      success: function(data) {
        this.setState({name: data.name,
        link: data.link,
        reason: data.reason,
        cryso_approved: data.cryso_approved,
        pylo_approved: data.pylo_approved,
        requested_by: data.requested_by,
        loaded: true});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        this.setState({failed: true});
      }.bind(this)
    });
  },
  approveItem: function(){
    if((this.state.cryso==undefined)&&(this.state.pylo===undefined)){
      return;
    }
    console.log(this.state.pylo);
    data_ = {
      'identifier':this.state.id,
      'status':1,
      'cryso_approved':(this.state.cryso==='1'),
      'pylo_approved':(this.state.pylo==='1')
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
        Materialize.toast('Success!', 4000) // 4000 is the duration of the toast
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/_ah/api/items_api/v1/item', status, err.toString());
      }.bind(this)
    });
  },
  declineItem: function(){
    if((this.state.cryso==undefined)&&(this.state.pylo===undefined)){
      return;
    }
    data_ = {
      'identifier':this.state.id,
      'status':4
    };
    $.ajax({
      url: '/_ah/api/items_api/v1/item/change',
      dataType: 'json',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(data_),
      success: function(data) {
        console.log("Sucess!");
        Materialize.toast('Claimed Denied!', 4000) // 4000 is the duration of the toast
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/_ah/api/items_api/v1/item', status, err.toString());
      }.bind(this)
    });
  },
  getUrlParam: function(name){
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  },
  getInitialState: function(){
    return{
      name: '',
      link: '',
      reason: '',
      cryso_approved: '',
      pylo_approved: '',
      requested_by: '',
      loaded: false,
      id: this.getUrlParam('id'),
      cryso: this.getUrlParam('cryso'),
      pylo: this.getUrlParam('pylo'),
      failed: false
    }
  },
  createName: function(name){
    return <span className="card-title activator grey-text text-darken-4">{name}</span>;
  },
  componentDidMount: function(){
    this.loadFromServer()
  },
  render: function(){
    if(this.state.failed){
      return(
        <div className='container'>
          <div className='card'>
            <div className='card-content'>
              Loading from Server Failed
            </div>
          </div>
        </div>
      );
    }
    if(!this.state.loaded){
        return(
          <div className='container'>
            <div className='card'>
              <div className='card-content center-align'>
                <Loader/>
              </div>
            </div>
          </div>
        );
    }
    return(
      <div className='container'>
        <div className='card'>
          <div className='card-content'>
            <span className='right'>Requested By: <a href={'mailto:'+this.state.requested_by}>{this.state.requested_by}</a></span>
            {this.createName(this.state.name)}

            <p>
              {this.state.reason}
            </p>
            <br/>
            <br/>
            <a className="waves-effect waves-light btn space-right mobile-click" onClick={this.approveItem}>Approve</a>
            <a className="waves-effect waves-light btn mobile-click" onClick={this.declineItem}>Deny</a>
          </div>
        </div>
      </div>
    )
  }
});


var Main = React.createClass({
  render: function() {
    return (
        <div>
          <NavBar/>
          <Item/>
        </div>
    );
    }
  });
  React.render(
    <Main />,	document.getElementById('react_content')
);
