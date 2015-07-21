var Item = React.createClass({
  render: function(){
    return (
      <div className='item'>
        {this.props.name}
      </div>
    );
  }
});

var ItemList = React.createClass({
  getInitialState: function(){
    return {
      
    };
  },
});

var CommentBox = React.createClass({
  render: function() {
    return (
        <div className="commentBox">
          <Item name='Bleach'/>
        </div>
    );
    }
  });
  React.render(
    <CommentBox />,	document.getElementById('content')
);
