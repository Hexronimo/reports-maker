var reportsApi = Vue.resource('/reports-maker/reports{/id}');
var layoutsApi = Vue.resource('/reports-maker/reports/layout{/id}');

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
    templatePart4: false,
    templatePart5: false,
    
    layout: {},
    photos: null,

    newDoc: [],

    form: {
      disabled: true,
      isvalid1: null,
      isvalid2: null,
      isvalid3: null
    },

    selectedDocType: null,
    docType: [
      {value: null, text: "---"},
      {value: 1, text:"Фотоотчёт"}
    ],

    reports: []
    },
    created: function() {
        reportsApi.get().then(result =>
        result.json().then(data =>
          data.forEach(report => this.reports.push(report))
        )
       ),
       layoutsApi.get().then(result =>
        result.json().then(data =>
          (this.layout = data[0]))
        
       )
    },
    methods: {
      addNewReportTemplate() {
        this.templatePart1 = false
        this.templatePart2 = true
        this.templatePart3 = false
        this.templatePart4 = false
        this.selected = [{}]
        this.form.disabled = false
      },
      openReportTemplate() {
        this.templatePart1 = false
        this.templatePart2 = true
        this.templatePart3 = true
        this.templatePart4 = false
        this.form.disabled = true
      },
      listReportsTemplate() {
        this.templatePart1 = true
        this.templatePart2 = false
        this.templatePart3 = false
        this.templatePart4 = false
        this.templatePart5 = false
        this.selected = [{}]
        this.form.disabled = true
        this.seen = false
        this.$refs.selectableTable.clearSelected()
      },
      createNewDoc(){
        if (this.newDoc == null || this.selectedDocType == null) return;
        this.templatePart4 = true
        this.templatePart3 = false

        this.newDoc = { 
          headRight: this.replacePatterns(this.layout.headRight),
          headCenter: this.replacePatterns(this.layout.headCenter),
          headLeft: this.replacePatterns(this.layout.headLeft),
          body: this.replacePatterns(this.layout.body),
          footerLeft: this.replacePatterns(this.layout.footerLeft),
          footerCenter: this.replacePatterns(this.layout.footerCenter),
          footerRight: this.replacePatterns(this.layout.footerRight),
          footer: this.replacePatterns(this.layout.footer)
        }
        
          },
      replacePatterns(str){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = dd + '.' + mm + '.' + yyyy;

        var rep = ""
        for (t of this.docType) {
          if(t.value == this.selectedDocType) {
            rep = t.text;
          }
        }

        var str1 = str.replace("{org}", this.layout.organization)
          .replace("{dirname}", this.layout.directorName)
          .replace("{dirpos}", this.layout.directorPosition)
          .replace("{org}", this.layout.organization)
          .replace("{today}", today)
          .replace("{repname}",rep)
          .replace("{name}", this.selected[0].officialName)
          .replace("{repname}", this.selectedDocType)
          .replace(new RegExp('\r?\n','g'), '<br>')
          .replace("<c>", '<p class="text-center">')
          .replace("<l>", '<p class="text-left">')
          .replace("<r>", '<p class="text-right">')
          .replace("<b>", '<span class="font-weight-bold">')
          .replace("</b>", "</span>")
          .replace("</lcr>", "</p>")
        return str1;  
      },
      layoutDesigner(){
        this.templatePart1 = false
        this.templatePart2 = false
        this.templatePart3 = false
        this.templatePart4 = false
        this.templatePart5 = true
      },
      onReportEdit(){
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
      onReportSubmit(evt){
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
        this.openReportTemplate();
      },
      onReportDelete() {
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
      onLayoutSubmit(evt){
        evt.preventDefault()
        this.$http.put('reports/layout', this.layout).then(result => {
          if (result.ok) {
                this.$bvToast.toast('Обновлено успешно',{
                title: 'Уведомление',
                variant: "success",
                autoHideDelay: 2000
                })
          }
        })
      
      },
      uploadPhotos(){
        var formData = new FormData();
        formData.append("photos", this.photos);
        this.$http.post('reports/photo', formData).then(result => {
          if (result.ok) {
                this.$bvToast.toast('Загружено успешно',{
                title: 'Уведомление',
                variant: "success",
                autoHideDelay: 2000
                })
          }
        })
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

