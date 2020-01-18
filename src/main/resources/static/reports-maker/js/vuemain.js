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
            key: 'fancyDateStart',
            label: 'Дата начала',
            sortable: true
          },
          {
            key: 'fancyDateEnd',
            label: 'Дата окончания',
            sortable: false
          }
        ],
    seen: false,
    selected: [{}],
    templatePart1: true,
    templatePart2: false,
    templatePart3: false,
    form: {
      disabled: true,
      isvalid1: null,
      isvalid2: null,
      isvalid3: null
    },
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
      add: function() {
        this.templatePart1 = false
        this.templatePart2 = true
        this.selected = [{}]
        this.form.disabled = false
      },
      open: function() {
        this.templatePart1 = false
        this.templatePart2 = true
        this.form.disabled = true
      },
      del: function() {
        reportsApi.remove({id: this.selected[0].id}).then(result => {
            if (result.ok) {
                this.reports.splice(this.reports.indexOf(this.selected[0]), 1);
                this.selected = [{}]
                this.$bvToast.toast('Удалено успешно',{
                title: 'Уведомление',
                variant: "success",
                autoHideDelay: 2000
                })
              } 
            }
          )
      },
      listview: function() {
        this.templatePart1 = true
        this.templatePart2 = false
        this.templatePart3 = false
        this.selected = [{}]
        this.form.disabled = true
        this.seen = false
        this.$refs.selectableTable.clearSelected()
      },
      editClick: function(){
        this.form.disabled = false  
      },
      valideForm: function(){
        var errorName= false, errorStartDate = false, errorEndDate = false
        if (!this.selected[0].name) {
        errorName = true
        this.form.isvalid1 = false
        } else {
          errorName = false
        }
        if (!this.selected[0].dateStart) {
          errorStartDate = true
          this.form.isvalid2 = false
        } else {
          errorStartDate = false
        }
        if ((this.selected[0].dateStart != null && this.selected[0].dateEnd != null) && this.selected[0].dateStart > this.selected[0].dateEnd) {
            errorEndDate = true
            this.form.isvalid3 = false
        } else {
          errorEndDate = false
        }

        if (errorName == true || errorEndDate == true || errorStartDate == true) return false;
        return true;
      },
      onSubmit(evt){
        evt.preventDefault()
        if (this.valideForm() == false) return;
        this.form.isvalid1 = null
        this.form.isvalid2 = null
        this.form.isvalid3 = null

        if(!this.selected[0].id != null){
            reportsApi.save({}, this.selected[0]).then(result => {
            result.json()
          })  
        } else {
          reportsApi.save({}, this.selected[0]).then(result => {
            result.json().then(data =>
            this.reports.push(data[data.length-1])
            )
          })
        }
        
        this.form.disabled = true
      },
      onRowSelected(item) {
        if (item.length == 0) {
          this.seen = false; 
          this.selected = [{}];
        } else {
          this.seen = true;
          this.selected = item;
        }

      }

    }
});

