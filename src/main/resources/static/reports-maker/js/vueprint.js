var app = new Vue({
	  el: '#printRoot',
	  data: {
		item: {},  
		id : null
	  },
	  created: function() {
		  var resource = this.$resource('/reports-maker/reports/doc{/id}');
		  var url = new URL(window.location.href);
		  var id = url.searchParams.get("id");
		  this.id = id;
		  resource.get({id : this.id}).then(result => {
			  result.json().then(data => {
			    this.item = data;
			  })
		  });
	  }
});