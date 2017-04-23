var app = new xenoJS('app');
class XenoApp{
	constructor(appName){

	}
}
class XenoRestManager{
	constructor(className){
		
	}
	getRestEntity(){return this.restEntity};
	setRestEntity(restEntity){this.restEntity = restEntity; return this;};
}

XenoRestManager.prototype.rest = function(){
	console.log(this);
	if(this.restEntity.hasOwnProperty('getAllUrl'))getAllUrl = this.restEntity.getAllUrl;
	else getAllUrl = this.restEntity.restUrl;
	if(this.restEntity.hasOwnProperty('getOneUrl'))getOneUrl = this.restEntity.getOneUrl;
	else getOneUrl = this.restEntity.restUrl;
	return {
			getOne : function(p){
				return new Promise(function(resolve,reject){
				app.$http.get(getOneUrl,function(data){
					for(i in p) p[i] = data[i];		
					resolve(p);
				})
			})
			},
			getAll : function(p){
				return new Promise(function(resolve,reject){
				app.$http.get(getAllUrl,function(data){
					let result = [];
					for(i in data.data)
					{
						for(j in p) p[j] = data.data[i][j];
						result.push(p);		
					}
					resolve(result);
				})
			})
			}
	}
}

class XenoView{
	constructor(controller){
		this.viewName = controller;
		return {
			bind : function(elem,value){
				document.querySelector('[x-controller='+controller+']').querySelector(elem).innerHTML = value;
			}
		}
	}
}

class XenoController{
	constructor(controller){
		this.controllerName = controller;
		this.view = new XenoView(controller);
	}
	get getView(){return this.view}
}

class XenoService{
	constructor(service){
		this.service = service;
	}
}

/* @Entity */
class Personne{
	constructor(name='',email='',age='')
	{
		this.name = name; 
		this.email = email; 
		this.age = age;
	}
	get getName(){return this.name};
	set setName(name){this.name = name}; 
	get getEmail(){return this.email};
	set	setEmail(email){this.email = email};
	get	getAge(){return this.age};
	set	setAge(age){this.age = age};  
	get toString(){return JSON.stringify(this)};
}

class PersonneDao extends XenoRestManager{
	constructor(){
		super();
		this.setRestEntity({
			name : 'Personne',
			restUrl : 'personne.json',
			getOneUrl : 'personne.json',
			getAllUrl : 'personnes.json'
		});
	}
}

class PersonneService extends XenoService{
	constructor(){
		super();
	}
	getAll(){ return new Promise(function(resolve,reject){
			var personneDao = new PersonneDao();
			personneDao.rest().getOne(new Personne()).then(function(personne){
			resolve(personne.name);
			});
	})
	}
}

class MyController extends XenoController{
	constructor(controller){
		super(controller);
		var personneService = new PersonneService();
		let view = this.view;
		personneService.getAll().then(function(name){
			view.bind('#name',name);
		})

	}
}

class MySecondController extends XenoController{
	constructor(controller){
		super(controller);
		var personneDao = new PersonneDao();
		let view = this.view;
		personneDao.rest().getAll(new Personne()).then(function(personne){
			view.bind('p',personne[1].email);
		});
	}
}

let ctrl = new MyController("myController");
let ctrl2 = new MySecondController("mySecondeController");