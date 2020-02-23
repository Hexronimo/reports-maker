var reportsApi = Vue.resource('/reports-maker/reports{/id}');
var docsApi = Vue.resource('/reports-maker/reports/doc{/id}{/type}');

var app = new Vue({
  el: '#root',
  data: {
    report: { // текущее мероприятие (набор отчетов)
    	docs:[]
    }, 
    form: { //форма создания меропрития 
        disabled: false,
        isvalid1: null,
        isvalid2: null,
        isvalid3: null
    },
    layout: {}, // данные базового шаблона документа
    fields: [   // табличка с документами
        {
          key: 'selected',
          label: 'Выбрано'
        },
        {
        	key: 'docname',
        	label: 'Документ',
        	sortable: true
        },
    ],
    photos: [], // фото, выбранные в форме 
    uploadedPhotos: [], // фото, загруженные уменьшенные, они же фото из выбранного Документа, если есть
    template: { //показ определенных участков страницы при редактировании Документа
		showSelectDocType: false,
	  	showEditor: false,
    },
    mainProps: { // стиль фотографий Фотоотчета 
          center: true,
          fluidGrow: true,
          blank: true,
          blankColor: '#bbb',
          width: 600,
          height: 400,
          class: 'my-2'
        },
    docs:[], // документы (отчеты) этого мероприятия
    newDoc: { //документ при создании (когда еще не сохранен) или редактировании 
    	layout: {},
    	type: null
    },
    selectedDoc: {}, //документ выделенный в таблице (лэйзи, только id и тип)
    docType: [ //типы документов, пока что только фотоотчет. Используется в селекте
      {value: null, text: '---'},
      {value: 1, text: 'Фотоотчёт'}
    ]
  },
  created: function() {
	  var url = new URL(window.location.href); //берем id из url, если он там есть (редактирование)
	  var id = url.searchParams.get("id");
	  if (id != null) {
		  reportsApi.get({id : id}).then(result => {
			  result.json().then(data => {
				  this.report = data;
				  for(docId of this.report.docs) {											  
					  docsApi.get({id: docId, type: 'type'}).then(		// загружаем id документов и их тип (лэйзи, чтобы все целиком не грузить)
							  t => {							  
								  this.docs.push({id : docId, type: t.body.type});
							  }
					  )
				  }  
			  })
		  });
		  this.form.disabled = true;
		  this.template.showSelectDocType = true;
	  }
	  var resource = this.$resource('/reports-maker/reports/layout{/id}'); // загружаем базовый шаблон
	  resource.get().then(result =>
	  result.json().then(data =>
	  (this.layout = data[0]))
	  );
  },
  methods: {
	  onDocCreate(){	
		  if (this.newDoc.type == null) {
			  this.$bvToast.toast('Сначала выберите тип документа',{
				  title: 'Уведомление',
				  variant: "info",
				  autoHideDelay: 2000
			  });
			  return;
		  }	  
		  this.newDoc.layout = { 
				  headRight: this.replacePatterns(this.layout.headRight),
				  headCenter: this.replacePatterns(this.layout.headCenter),
				  headLeft: this.replacePatterns(this.layout.headLeft),
				  body: this.replacePatterns(this.layout.body),
				  footerLeft: this.replacePatterns(this.layout.footerLeft),
				  footerCenter: this.replacePatterns(this.layout.footerCenter),
				  footerRight: this.replacePatterns(this.layout.footerRight),
				  footer: this.replacePatterns(this.layout.footer)
		  } 
		  this.template.showEditor = true;
		  this.template.showSelectDocType = false;       

	  },
	  onDocEdit(){
		  if (this.selectedDoc.id == null) return;
		  docsApi.get({id: this.selectedDoc.id}).then(result => {
			  result.json().then(data => {
				  this.newDoc = data;
				  this.uploadedPhotos = this.newDoc.photos;
				  this.template.showEditor = true;
				  this.template.showSelectDocType = false; 
			  })
		  }, result => {
			  this.$bvToast.toast('Произошла ошибка',{
				  title: 'Уведомление',
				  variant: "danger",
				  autoHideDelay: 2000
			  });
		  })		 		  
	  },
	  closeDocEditTemplate(){
		  this.newDoc = {layout:{}};
		  this.selectedDoc = {};
		  this.uploadedPhotos = [];
		  this.template.showEditor = false;
		  this.template.showSelectDocType = true;
	  },
	  docName(i){ // возвращает название соответвующее числовому значению типа документа, 1 -> Фотоотчёт и т.п.
		  for (t of this.docType) {
			  if(t.value == i) {
				  return t.text;
			  }
		  }
		  return 'Документ';
	  },
      onReportEdit(){
        this.form.disabled = false;  
      },
      valideForm: function(){
        var errorName= false, errorStartDate = false, errorEndDate = false;
        if (!this.report.name) {
        errorName = true
        this.form.isvalid1 = false;
        } else {
          errorName = false;
        }
        if (!this.report.dateStart) {
          errorStartDate = true;
          this.form.isvalid2 = false;
        } else {
          errorStartDate = false;
        }
        if ((this.report.dateStart != null && this.report.dateEnd != null) && this.report.dateStart > this.report.dateEnd) {
            errorEndDate = true;
            this.form.isvalid3 = false;
        } else {
          errorEndDate = false;
        }
        if (errorName == true || errorEndDate == true || errorStartDate == true) return false;
        return true;
      },
      onReportSubmit(evt){
        evt.preventDefault();
        if (this.valideForm() == false) return;
        this.form.isvalid1 = null;
        this.form.isvalid2 = null;
        this.form.isvalid3 = null;
        this.saveReport();
        this.form.disabled = true;
        this.template.showSelectDocType = true;
      },     
      saveReport() {	
    	  reportsApi.save(this.report).then(result => {
    		  if (result.ok) {
    			  result.json().then(data => {
    			  this.report = data;
    			  this.$bvToast.toast('Сохранено успешно',{
    				  title: 'Уведомление',
    				  variant: "success",
    				  autoHideDelay: 2000
    			  });
    			  });
    		  } else {
    			  this.$bvToast.toast('Произошла ошибка',{
    				  title: 'Уведомление',
    				  variant: "danger",
    				  autoHideDelay: 2000
    			  });
    		  }
    	  })  
      },      
      onReportDelete() {
    	  reportsApi.remove({id: this.report.id}).then(result => {
    		  if (result.ok) {
    			  this.report = {}
    			  this.newDoc = {layout:{}}
    			  this.uploadedPhotos = []; 			  
    			  this.$bvToast.toast('Удалено успешно',{
    				  title: 'Уведомление',
    				  variant: "success",
    				  autoHideDelay: 1000
    			  })
    	    	  var url = "index.html";
    	    	  var win = window.open(url, '_self');
    	    	  win.focus();
    		  } else {
    			  this.$bvToast.toast('Произошла ошибка',{
    				  title: 'Уведомление',
    				  variant: "danger",
    				  autoHideDelay: 2000
    			  })
    		  }
    	  }
    	  )
      },
      uploadPhotos(){
    	if (this.photos == null || this.photos.length == 0) return; 
        var formData = new FormData();
        formData.append('reportId', this.report.id);
        for (var i = 0; i < this.photos.length; i++) {
          formData.append('photos'+i, this.photos[i]);
        }
        this.$http.post('reports/photo', formData).then(result => {
          if (result.ok) {
                this.$bvToast.toast('Обновлено успешно',{
                title: 'Уведомление',
                variant: "success",
                autoHideDelay: 2000
                });
                this.$refs['file-input'].reset();
                this.photos = null;
                this.countPaperFormat();
                result.json().then(data => {
                    this.uploadedPhotos = this.uploadedPhotos.concat(data);
                });
          }
        })
      },
      delPhoto(i){
    	  this.uploadedPhotos.splice(i,1);
      },
      onDocSave(){
    	  if(this.report.docs == null) this.report.docs = [];
    	  this.newDoc.data = document.getElementById('paper').innerHTML;
    	  this.newDoc.photos = this.uploadedPhotos;

    	  docsApi.save(this.newDoc).then(result => {
    		  if(result.ok) {
    			  result.json().then(data => {
    				  	if(this.report.docs.includes(data.id) == false) {
      					  this.report.docs.push(data.id);
      					  this.docs.push({id : data.id, type: this.newDoc.type});  
    					  this.saveReport(); 
    				  	}
    					  this.newDoc.id = data.id;	  
    					  this.selectedDoc.id = data.id;
    					  this.selectedDoc.type = this.newDoc.type;
    				  })
    			  }	  
    	  })
    	  
      },
      onDocPrint(){
    	  if (this.selectedDoc.id == null) {
			  this.$bvToast.toast('Сначала выберите документ',{
				  title: 'Уведомление',
				  variant: "info",
				  autoHideDelay: 2000
			  });
			  return;
    	  }
    	  var url = "print-page.html?id=" + this.selectedDoc.id;
    	  var win = window.open(url, '_blank');
    	  win.focus();
      },
      onRowSelected(item){
          if (item.length == 0) {
              this.selectedDoc = {};
            } else {
              this.selectedDoc = item[0];
            }
      },
      onDocDelete(){
    	  docsApi.remove({id: this.selectedDoc.id, reportId:this.report.id}).then(
    			  result => {											// хороший	  	 
    				  var index = this.report.docs.indexOf(this.selectedDoc.id);
    				  if (index > -1) {
    					  this.report.docs.splice(index, 1);
    				  }
    				  this.docs = [];
    				  for(docId of this.report.docs) {											  
    					  docsApi.get({id: docId, type: 'type'}).then(		
    							  t => {							  
    								  this.docs.push({id : docId, type: t.body.type});
    							  }
    					  )
    				  }  

    				  this.selectedDoc = {};

    				  this.$bvToast.toast('Удалено успешно',{
    					  title: 'Уведомление',
    					  variant: "success",
    					  autoHideDelay: 2000
    				  });
    			  }, 
    			  result => { 											// плохой
    				  this.$bvToast.toast('Ошибка при удалении',{
    					  title: 'Уведомление',
    					  variant: "danger",
    					  autoHideDelay: 2000
    				  });

    			  })
      },
      countPaperFormat(){
          var paper = document.getElementById('paper') 
          var w = paper.offsetWidth;
          paper.style.width = w + 'px';
          paper.style.height = (w * 1.41) + 'px';
      },
	  replacePatterns(str){
		  if (str == null) return "";
		  var today = new Date();
		  var dd = String(today.getDate()).padStart(2, '0');
		  var mm = String(today.getMonth() + 1).padStart(2, '0');
		  var yyyy = today.getFullYear();
		  today = dd + '.' + mm + '.' + yyyy;
		  var rep = ""
			  for (t of this.docType) {
				  if(t.value == this.newDoc.type) {
					  rep = t.text;
				  }
			  }
		  var str1 = str.replace("{org}", this.layout.organization)
		  .replace("{dirname}", this.layout.directorName)
		  .replace("{dirpos}", this.layout.directorPosition)
		  .replace("{org}", this.layout.organization)
		  .replace("{today}", today)
		  .replace("{repname}",rep)
		  .replace("{name}", this.report.officialName)
		  .replace("{repname}", this.newDoc.type);
		  return str1;  
	  },
	  replaceStyles(str){
		  if (str == null) return "";
		  var str1 = str.replace(new RegExp('\r?\n','g'), '<br>')
		  .replace("<c>", '<p class="text-center">')
		  .replace("<l>", '<p class="text-left">')
		  .replace("<r>", '<p class="text-right">')
		  .replace("<b>", '<span class="font-weight-bold">')
		  .replace("</b>", "</span>")
		  .replace("</lcr>", "</p>");
		  return str1;  
	  }
    }
});