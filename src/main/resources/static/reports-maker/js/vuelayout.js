var layoutsApi = Vue.resource('/reports-maker/reports/layout{/id}');

var app = new Vue({
	el: '#root',
	data: {
		layout: {},
	},
	created: function() {
		layoutsApi.get().then(result =>
		result.json().then(data =>
		(this.layout = data[0]))
		)
	},
	methods: {
		onLayoutSubmit(evt){
			evt.preventDefault()
			this.$http.put('reports/layout', this.layout).then(result => {
				if (result.ok) {
					this.$bvToast.toast('Обновлено успешно',{
						title: 'Уведомление',
						variant: "success",
						autoHideDelay: 2000
					})
				} else {
					this.$bvToast.toast('Произошла ошибка',{
						title: 'Уведомление',
						variant: "danger",
						autoHideDelay: 2000
					})					
				}
			})
		}
	}
});