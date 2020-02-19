var reportsApi = Vue.resource('/reports-maker/reports{/id}');

var app = new Vue({
  el: '#root',
  data: {
	sortBy: 'dateStart',
    fields: [
          {
            key: 'selected',
            label: 'Выбрано'
          },
          {
            key: 'name',
            label: 'Название мероприятия',
            sortable: true
          },
          {
            key: 'fancyDateStart',
            label: 'Дата начала',
            sortable: false
          },
          {
            key: 'fancyDateEnd',
            label: 'Дата окончания',
            sortable: false
          },
          {
              key: 'dateStart',
              label: 'Сортировка по дате',
              sortable: true
          },
        ],
    seen: false,
    selected: null,
    reports: []
    },
    created: function() {
        reportsApi.get().then(result =>
        result.json().then(data =>
          data.forEach(report => this.reports.push(report))
        )
        )
    },
    methods: {
    onOpenReport() {
    	  var url = "edit-report.html?id=" + this.selected[0].id;
    	  var win = window.open(url, "_self");
      },
      onReportDelete() {
        reportsApi.remove({id: this.selected[0].id}).then(result => {
            if (result.ok) {
                this.reports.splice(this.reports.indexOf(this.selected[0]), 1);
                this.selected = null
                this.$bvToast.toast('Удалено успешно',{
                title: 'Уведомление',
                variant: "success",
                autoHideDelay: 2000
                })
              } 
            }
          )
      },
      onRowSelected(item) {
        if (item.length == 0) {
          this.seen = false; 
          this.selected = null;
        } else {
          this.seen = true;
          this.selected = item;
        }

      }
    }
});

