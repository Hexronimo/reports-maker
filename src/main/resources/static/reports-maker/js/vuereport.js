var reportsApi = Vue.resource('/reports-maker/reports{/id}');
var docsApi = Vue.resource('/reports-maker/reports/doc{/id}');

var app = new Vue({
  el: '#root',
  data: {
    seen: false,
    report: {
    	docs:[]
    }, 
    layout: {},
    fields: [
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
    photos: [],
    uploadedPhotos: [],
    template: {
		showSelectDocType: false,
	  	showEditor: false,
    },
    mainProps: {
          center: true,
          fluidGrow: true,
          blank: true,
          blankColor: '#bbb',
          width: 600,
          height: 400,
          class: 'my-2'
        },
    docs:[],
    newDoc: {
    	layout: {}
    },
    form: {
      disabled: false,
      isvalid1: null,
      isvalid2: null,
      isvalid3: null
    },
    selectedDocType: null,
    docType: [
      {value: null, text: "---"},
      {value: 1, text:"Фотоотчёт"}
    ]
  },
  created: function() {
	  var url = new URL(window.location.href);
	  var id = url.searchParams.get("id");
	  if (id != null) {
		  this.id = id;
		  this.form.disabled = true;
		  this.template.showSelectDocType = true;
		  reportsApi.get({id : this.id}).then(result => {
			  result.json().then(data => {
				  this.report = data;
				  for(docId of this.report.docs) {
					  docsApi.get({id : docId}).then(result => {
						  result.json().then(data => {
							  this.docs.push(data);
						  })
					  });
				  }  
			  })
		  });	  
	  }
	  var resource = this.$resource('/reports-maker/reports/layout{/id}');
	  resource.get().then(result =>
	  result.json().then(data =>
	  (this.layout = data[0]))
	  );
  },
  methods: {
	  createNewDoc(){
		  if (this.selectedDocType == 0) return;
		  
		  if (Object.keys(this.newDoc.layout).length === 0) {
			  this.newDoc.type = this.selectedDocType;
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
		  }
		  this.template.showEditor = true;
		  this.template.showSelectDocType = false;       

	  },
	  closeDocEdit(){
		  this.newDoc = {layout:{}};
		  this.template.showEditor = false;
		  this.template.showSelectDocType = true;
	  },
	  selectDoc(i){
		if(this.newDoc.id == null){ 
			this.newDoc = this.docs[i];  
			this.selectedDocType = this.newDoc.type;
			this.uploadedPhotos = this.newDoc.photos;
	  	} else {
	  		this.newDoc = {layout:{}};
	  	}
	  },
	  docName: function(i){
		  for (t of this.docType) {
			  if(t.value == i) {
				  return t.text;
			  }
		  }  
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
		  .replace("{name}", this.report.officialName)
		  .replace("{repname}", this.selectedDocType);
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
    		  reportsApi.save(this.report.id, this.report).then(result => {
    			  if (result.ok) {
    				  result.json().then(data => this.report = data);
      				  this.$bvToast.toast('Обновлено успешно',{
    					  title: 'Уведомление',
    					  variant: "success",
    					  autoHideDelay: 2000
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
    			  this.$bvToast.toast('Удалено успешно',{
    				  title: 'Уведомление',
    				  variant: "success",
    				  autoHideDelay: 2000
    			  })
    	    	  var url = "index.html";
    	    	  var win = window.open(url, '_self');
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
    	if (this.photos == null) return; 
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
    	  this.$http.put('reports/doc', this.newDoc).then(result => {
    		  result.json().then(data => {
    			  this.report.docs.push({data.id : data.type});
    			  this.newDoc = data;
    			  this.saveReport();
    		  })
    	  })
      },
      onDocPrint(){
    	  var url = "print-page.html?id=" + this.newDoc.id;
    	  var win = window.open(url, '_blank');
    	  win.focus();
      },
      onRowSelected(){
    	  return false;
      },
      onDocDelete(){
	
	},
      countPaperFormat(){
          var paper = document.getElementById('paper') 
          var w = paper.offsetWidth;
          paper.style.width = w + 'px';
          paper.style.height = (w * 1.41) + 'px';
      }
    }
});