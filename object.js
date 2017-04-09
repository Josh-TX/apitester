app.directive("apitObject", function(){
	var directive = {
		template: '<div style="display: inline">\
			<div ng-repeat="prop in objCtrl.props track by $index">\
				<div class="input-wrapper" style="margin-left: {{objCtrl.indent*6}}%;">\
					<div class="input-group">\
						<input class="form-control" ng-model="prop.key" placeholder="key"></input>\
						<div class="input-group-addon">:</div>\
					</div>\
				</div>\
				<div ng-if="prop.type == \'string\'" class="input-wrapper">\
					<div class="input-group">\
						<div class="input-group-addon">"</div>\
						<input class="form-control" ng-model="prop.val" placeholder="value"></input>\
						<div class="input-group-addon">"&nbsp;{{objCtrl.getComma($index)}}</div>\
					</div>\
				</div>\
				<div ng-if="prop.type == \'number\'" class="input-wrapper">\
					<div class="input-group">\
						<input type=number class="form-control" ng-model="prop.val" placeholder="value"></input>\
						<div class="input-group-addon">{{objCtrl.getComma($index)}}</div>\
					</div>\
				</div>\
				<div ng-if="prop.type == \'object\'" class="input-wrapper">\
					<div class="input-group">\
						<label>{</label>\
					</div>\
				</div>\
				<div ng-if="prop.type ==\'object\'" apit-object obj="prop.val" indent="objCtrl.indent + 1"></div>\
			</div>\
			<label style="margin-left: {{ (objCtrl.indent-1)*6 }}%;">}</label>\
			<button class="btn btn-default buffer"><span class="glyphicon glyphicon-plus"></span>&nbsp;string</button>\
			<button class="btn btn-default buffer"><span class="glyphicon glyphicon-plus"></span>&nbsp;number</button>\
			<button class="btn btn-default buffer"><span class="glyphicon glyphicon-plus"></span>&nbsp;object</button>\
		</div>',
        restrict: 'AE',
		scope: {
			indent: '=',
            obj: '='
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
		self.getComma = function(index){
			if (index == self.props.length - 1){
				return "\xa0"; //non-breaking space
			} 
			return ",";
		}
	}
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