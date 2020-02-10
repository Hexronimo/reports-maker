var reportsApi = Vue.resource('/reports-maker/reports{/id}');

var app = new Vue({
  el: '#root',
  data: {
    fields: [
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
    reports: []
    },
    methods: {
      myProvider() {
      return reportsApi.get().then(result =>
        result.json()
       )
      }
    }
});