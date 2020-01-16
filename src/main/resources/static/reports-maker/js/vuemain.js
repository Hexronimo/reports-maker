var reportsApi = Vue.resource('/reports-maker/reports{/id}');



var app = new Vue({
  el: '#root',
  data: {
    fields: [
          {
            key: 'selected',
            label: 'Выбран'
          },
          {
            key: 'name',
            label: 'Название мероприятия',
            sortable: true
          },
          {
            key: 'dateStart',
            label: 'Дата начала',
            sortable: true
          },
          {
            key: 'dateEnd',
            label: 'Дата окончания',
            sortable: false
          }
        ],
    seen: false,
    selected: [],
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
      onRowSelected(item) {
        if (item.length > 0) {
          app.seen = true; 
        } else {
          app.seen = false;
        }
        this.selected = item;
      },
      del: function() {
        reportsApi.remove({id: this.selected[0].id}).then(result => {
            if (result.ok) {
                this.reports.splice(this.reports.indexOf(this.selected[0]), 1);
                this.selected.splice(0,1);
                this.$bvToast.toast('Удалено успешно',{
                title: 'Уведомление',
                variant: "success",
                autoHideDelay: 2000
                })
              } 
            }
          )
      }
    }
});

