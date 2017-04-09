app.directive("apitObject", function(){
	var directive = {
		template: '<div style="display: inline"><br>\
			<div ng-repeat="prop in objCtrl.props track by $index">\
				<div ng-if="objCtrl.type == \'object\'" class="input-wrapper" style="margin-left: {{objCtrl.indent*6}}%;">\
					<div class="input-group" >\
						<input class="form-control" ng-model="prop.key" placeholder="key"></input>\
						<div class="input-group-addon">:</div>\
					</div>\
				</div>\
				<div ng-if="objCtrl.type == \'array\'" style="display: inline-block; margin-left: {{objCtrl.indent*6}}%;">\
				</div>\
				\
				<div ng-if="prop.type == \'string\'" class="input-wrapper">\
					<div class="input-group">\
						<div class="input-group-addon">"</div>\
						<input class="form-control" ng-model="prop.val" ng-change="objCtrl.changed()" placeholder="string"></input>\
						<div class="input-group-addon">"&nbsp;{{objCtrl.getComma($index)}}</div>\
					</div>\
				</div>\
				<div ng-if="prop.type == \'number\'" class="input-wrapper">\
					<div class="input-group">\
						<input type=number class="form-control" ng-model="prop.val" placeholder="number"></input>\
						<div class="input-group-addon">{{objCtrl.getComma($index)}}</div>\
					</div>\
				</div>\
				<div ng-if="prop.type == \'object\'" style="display: inline-block">\
					<div class="input-group">\
						<label>{</label>\
					</div>\
				</div>\
				<div ng-if="prop.type == \'array\'" style="display: inline-block">\
					<div class="input-group">\
						<label>[</label>\
					</div>\
				</div>\
				<div style="display: inline-block">\
					<div class="input-group">\
						<button type="button" class="btn btn-default" ng-click="objCtrl.removeProperty($index)">\
							<span class="glyphicon glyphicon-remove"></span>\
						</button>\
					</div>\
				</div>\
				<div ng-if="prop.type ==\'object\'" apit-object obj="prop.val" indent="objCtrl.indent + 1" type="object"></div>\
				<div ng-if="prop.type ==\'array\'" apit-object obj="prop.val" indent="objCtrl.indent + 1" type="array"></div>\
			</div>\
			<label ng-if="objCtrl.type ==\'object\'" style="margin-left: {{ (objCtrl.indent-1)*6 }}%;"> } </label>\
			<label ng-if="objCtrl.type ==\'array\'" style="margin-left: {{ (objCtrl.indent-1)*6 }}%;"> ] </label>\
			<button class="btn btn-default buffer" ng-click="objCtrl.addString()"><span class="glyphicon glyphicon-plus"></span>&nbsp;string</button>\
			<button class="btn btn-default buffer" ng-click="objCtrl.addNumber()"><span class="glyphicon glyphicon-plus"></span>&nbsp;number</button>\
			<button class="btn btn-default buffer" ng-click="objCtrl.addObject()"><span class="glyphicon glyphicon-plus"></span>&nbsp;object</button>\
			<button class="btn btn-default buffer" ng-click="objCtrl.addArray()"><span class="glyphicon glyphicon-plus"></span>&nbsp;array</button>\
		</div>',
        restrict: 'AE',
		scope: {
			indent: '=',
            obj: '=',
			type: '@'
        },
		replace: true,
        controller: objCtrl,
        controllerAs: 'objCtrl',
        bindToController: true
    };
    return directive;
	
	function objCtrl() {
		var self = this;
		self.props = getProps(self.obj);
		self.getComma = getComma;
		self.addString = addString;
		self.addNumber = addNumber;
		self.addObject = addObject;
		self.addArray = addArray;
		self.removeProperty = removeProperty;
		self.changed = changed;
		
		function addString(){
			self.props.push({
				key: "",
				val: "",
				type: "string"
			})
			changed();
		}
		function addNumber(){
			self.props.push({
				key: "",
				val: 0,
				type: "number"
			})
			changed();
		}
		function addObject(){
			self.props.push({
				key: "",
				val: {},
				type: "object"
			})
			changed();
		}
		function addArray(){
			self.props.push({
				key: "",
				val: [],
				type: "array"
			})
			changed();
		}
		function removeProperty(index){
			self.props.splice(index, 1);
			changed();
		}
		function changed(){
			if (self.type == "object"){
				setObject(self.obj);
			} else if (self.type == "array"){
				setArray(self.obj);
			} else {
				alert("unknown type");
			}
		}
		
		function getComma(index){
			if (index == self.props.length - 1){
				return "\xa0"; //non-breaking space
			} 
			return ",";
		}
		
		var setObject = function(obj){
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					delete obj[key];
				}
			}
			for (var i = 0; i < self.props.length; i++){
				obj[self.props[i].key] = self.props[i].val;
			}
		}
		var setArray = function(arr){
			arr.splice(0, arr.length);
			for (var i = 0; i < self.props.length; i++){
				arr[i] = self.props[i].val;
			}
		}
	}//end objCtrl
	
	function getProps(obj){
		var props = [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				var type = (Array.isArray(obj[key])) ? "array" : typeof obj[key];
				props.push({
					key: key,
					val: obj[key],
					type: type
				});
			}
		}
		return props;
	}
});

app.directive("apitIndent", function(){
	var directive = {
		scope: {
			apitIndent: '='
		},
		link: link
	}
	return directive;
	
	function link(scope, element){
		var indent = scope.apitIndent * 30;
		element.attr("style", "display: inline; margin-left: " + indent + "px;")
	}
		
});