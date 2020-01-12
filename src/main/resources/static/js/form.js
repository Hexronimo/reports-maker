const app = new Vue({
  el: '#root',
  data: {
    errors: [],
    name: null,
    dateStart: null,
    dateEnd: null
  },
  methods:{
    checkForm: function (e) {

      this.errors = [];

      if (!this.name) {
        this.errors.push('Напишите название.');
      }
      if (!this.dateStart) {
        this.errors.push('Дата начала не может быть пустой.');
      }
      if (this.dateStart > this.dateEnd) {
        this.errors.push('Дата окончания не может быть раньше даты начала.');
      }

      if (!this.errors.length) {
      return {
      report: {
        name: this.name,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd
      },
      submitted: false
    };
      }

      e.preventDefault();
    }
  }
})
